import * as ioProxy from "socket.io-client";
import { AuthManager } from "../authManager";
const io: SocketIOClientStatic = (ioProxy as any).default || ioProxy;

export type ContextType = "text" | "gmail";

/**
 * Snippet metadata
 */

export interface Snippet {
  'id_': string;
  'name': string;
  'content': string;
  'labels': string[];
}

/**
 * Reply metadata
 */
export interface ReplyMeta {
  prompt: string;
  suggestions: Reply[];
  type: string;
}

interface Reply {
  text: string;
  confidence: number;
}

export interface AutocompleteResponse {
  snippets: Snippet[];
  seedText: string;
  responseId: string;
}

export interface ReplyResponse {
  replies: ReplyMeta[];
  responseId: string;
}

export interface SessionError {
  status: "failure";
  reason: "exceeded_daily_usage_limit" | "expired_membership";
}

export interface AutocompleteSession {
  reconnect: () => Promise<void>;
  disconnect: () => void;
  setOnErrorHandler: (callback: (error: SessionError) => void) => void;
  queryByContent: (
    seedText: string,
    currentContext?: string
  ) => Promise<AutocompleteResponse | null>;
  queryByName: (
    query: string
  ) => Promise<AutocompleteResponse | null>;
  feedback: (
    responseId: string,
    snippet: Snippet,
    origin: string
  ) => Promise<void>;
}

/**
 * Point Websockets Api Instance
 */
export default class AutocompleteSessionImpl implements AutocompleteSession {
  /** Email address of Point user */
  private readonly emailAddress: string;
  /** AuthManager manages credentials & JWT */
  private authManager: AuthManager;
  /** Search type */
  private searchType: string;
  /** API URL */
  private readonly ApiUrl: string;
  /** @private SocketIO instance used to interact with Point API */
  private socket: SocketIOClient.Socket;

  /** @private Reconnect counter  */
  private reconnectCount: number = 0;

  /** @private Max reconnect attempts  */
  private readonly maxReconnects: number = 10;

  /** Error handler */
  private onErrorHandler: (error: SessionError) => void;

  /**
   * @param  emailAddress Email address of Point user
   * @param  authCode Auth code (JWT) provider
   */
  constructor(
    emailAddress: string,
    authManager: AuthManager,
    searchType = "standard",
    apiUrl = "https://v1.pointapi.com"
  ) {
    this.emailAddress = emailAddress;
    this.authManager = authManager;
    this.searchType = searchType;
    this.ApiUrl = apiUrl;
  }

  /**
   * Reconnects to the Point API socket.io
   */
  public async reconnect(): Promise<void> {
    this.disconnect();

    this.authManager.onJwtChange(this.onJwtChange);

    const jwt = await this.authManager.getJwt();

    this.socket = io(this.ApiUrl, {
      reconnection: false,
      query: {
        emailAddress: this.emailAddress,
        searchType: this.searchType
      },
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: "Bearer " + jwt
          }
        }
      }
    });

    this.socket.on("connect", () => {
      this.reconnectCount = 0;
    });

    this.socket.on("error", (error: SessionError) => {
      if (this.onErrorHandler) {
        this.onErrorHandler(error);
      }
    });

    this.socket.on("disconnect", (reason: any) => {
      // If client was the one that disconnected,
      // don't reconnect automatically.
      if (reason === "io client disconnect") return;

      // If server was the one that disconnected,
      // the authentication credentials are probably
      // invalid. Don't reconnect automatically.
      if (reason === "io server disconnect") return;

      // Try to reconnect maxReconnect times using exponentially
      // growing delays starting from 100ms
      if (this.reconnectCount < this.maxReconnects) {
        const delay = 100 * Math.pow(2, this.reconnectCount);
        this.reconnectCount++;
        setTimeout(() => {
          this.reconnect();
        }, delay);
      }
    });
  }

  /**
   * Disconnects from the Point API manually
   */
  public disconnect(): void {
    if (this.socket != null) {
      // Remove event listeners
      this.socket.removeAllListeners();

      // Close the connection
      this.socket.disconnect();
    }

    this.authManager.offJwtChange(this.onJwtChange);
  }

  /**
   * Registers error handler callback that will be invoked
   * on any socket.io session errors sent from the server.
   * 
   * @param callback Error callback method
   */
  public setOnErrorHandler = (callback: (error: SessionError) => void): void => {
    this.onErrorHandler = callback;
  }

  /**
   *  Query PointApi with seed text to get predicted suggestions
   * @param seedText The text to base suggestion predictions off of
   * @returns A list of the predicted suggestion objects
   */
  public queryByContent(
    seedText: string,
    currentContext?: string
  ): Promise<AutocompleteResponse | null> {
    return new Promise((resolve, reject) => {
      if (!this.socket || this.socket.disconnected) {
        reject("Socket is disconnected");
      }
      this.socket.emit(
        "querySnippetContents",
        { seedText: seedText.trim(), currentContext },
        (response: AutocompleteResponse) => {
          if (
            !response ||
            !response.snippets ||
            !response.snippets.length
          ) {
            resolve(null);
          }
          resolve(response);
        }
      );
    });
  }

  /**
   *  Query PointApi with a hotkey trigger to get a full hotkey suggestion
   * @param trigger String that is a shortcut for the full hotkey text
   * @returns A list of the predicted suggestion objects
   */
  public queryByName(query: string): Promise<AutocompleteResponse | null> {
    return new Promise((resolve, reject) => {
      if (!this.socket || this.socket.disconnected) {
        reject("Socket is disconnected");
      }
      this.socket.emit(
        "querySnippetNames",
        { query },
        (response: AutocompleteResponse) => {
          if (
            !response ||
            !response.snippets ||
            !response.snippets.length
          ) {
            resolve(null);
          }
          resolve(response);
        }
      );
    });
  }

  /**
   * Give feedback on Point Api's suggestions. 
   * This is like chosenSuggestion/Hotkey interaction.
   */
  public async feedback(
    responseId: string,
    snippet: Snippet,
    origin: string
  ): Promise<void> {
    this.socket.emit(
      "feedback",
      { responseId, snippet, origin },
      (response: { message: string; status: string }) => {
        if (!response || response.status !== "success") {
          if (response.message) {
            throw new Error(response.message);
          }
          throw new Error("Could not record feedback");
        }
      }
    );
  }

  /**
   *  Get reply suggestions given some recieved text
   */
  public reply(
    previousMessage: string,
    contextType: ContextType = "text"
  ): Promise<ReplyResponse | null> {
    return new Promise((resolve, reject) => {
      if (!this.socket || this.socket.disconnected) {
        reject("Socket is disconnected");
      }
      this.socket.emit(
        "reply",
        { previousMessage, contextType },
        (response: ReplyResponse) => {
          if (!response || !response.replies || !response.replies.length) {
            resolve(null);
          }
          resolve(response);
        }
      );
    });
  }

  /**
   * Callback function that handles JWT changed events.
   */
  private onJwtChange = (): void => {
    this.reconnect();
  }
}

import * as ioProxy from "socket.io-client";
import AuthManager from "../authManager";
const io: SocketIOClientStatic = (ioProxy as any).default || ioProxy;

export type ContextType = "text" | "gmail";

/**
 * Suggestion metadata
 */
export interface SuggestionMeta {
  suggestion: string;
  expandedSuggestion: string;
  userAdded: boolean;
  type: string;
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
  suggestions: SuggestionMeta[];
  seedText: string;
  responseId: string;
}

export interface ReplyResponse {
  replies: ReplyMeta[];
  responseId: string;
}

/**
 * Point Websockets Api Instance
 */
export default class AutocompleteSession {
  /** Email address of Point user */
  public readonly emailAddress: string;
  /** AuthManager manages credentials & JWT */
  public authManager: AuthManager;
  /** Search type */
  public searchType: string;
  /** API URL */
  public readonly apiUrl: string;
  /** @private SocketIO instance used to interact with Point API */
  private socket: SocketIOClient.Socket;

  /** @private Reconnect counter  */
  private reconnectCount: number = 0;

  /** @private Max reconnect attempts  */
  private readonly maxReconnects: number = 10;

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
    this.apiUrl = apiUrl;
  }

  /**
   * Reconnects to the Point API socket.io
   */
  public async reconnect(): Promise<void> {
    this.disconnect();

    this.authManager.onJwtChange(this.onJwtChange);

    const jwt = await this.authManager.getJwt();

    this.socket = io(this.apiUrl, {
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
   *  Query PointApi with seed text to get predicted suggestions
   * @param seedText The text to base suggestion predictions off of
   * @returns A list of the predicted suggestion objects
   */
  public autocomplete(
    seedText: string,
    currentContext?: string
  ): Promise<AutocompleteResponse | null> {
    return new Promise((resolve, reject) => {
      if (this.socket.disconnected) {
        reject("Socket is disconnected");
      }
      this.socket.emit(
        "autocomplete",
        { seedText: seedText.trim(), currentContext },
        (response: AutocompleteResponse) => {
          if (
            !response ||
            !response.suggestions ||
            !response.suggestions.length
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
  public hotkey(trigger: string): Promise<AutocompleteResponse | null> {
    return new Promise((resolve, reject) => {
      if (this.socket.disconnected) {
        reject("Socket is disconnected");
      }
      this.socket.emit(
        "hotkey",
        { trigger },
        (response: AutocompleteResponse) => {
          if (
            !response ||
            !response.suggestions ||
            !response.suggestions.length
          ) {
            resolve(null);
          }
          resolve(response);
        }
      );
    });
  }

  public variable(placeholder: string): Promise<AutocompleteResponse | null> {
    return new Promise((resolve, reject) => {
      if (this.socket.disconnected) {
        reject("Socket is disconnected");
      }
      this.socket.emit(
        "variable",
        { placeholder: placeholder },
        (response: AutocompleteResponse) => {
          if (
            !response ||
            !response.suggestions ||
            !response.suggestions.length
          ) {
            resolve(null);
          }
          resolve(response);
        }
      );
    });
  }

  /**
   *  Give feedback on Point Api's suggestions
   */
  public async feedback(
    responseId: string,
    suggestionText: string | string[],
    type: "positive" | "negative"
  ): Promise<void> {
    this.socket.emit(
      "feedback",
      { responseId, text: suggestionText, type },
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
   *  Set the context of the autocomplete session
   */
  public async setContext(
    previousMessage: string,
    contextType: ContextType = "text"
  ): Promise<void> {
    this.socket.emit(
      "set-context",
      { previousMessage, contextType },
      (response: { message: string; status: string }) => {
        if (!response || response.status !== "success") {
          if (response.message) {
            throw new Error(response.message);
          }
          throw new Error("Could not set context");
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
      if (this.socket.disconnected) {
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

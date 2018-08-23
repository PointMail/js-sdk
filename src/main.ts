import * as ioProxy from "socket.io-client";
const io: SocketIOClientStatic = (ioProxy as any).default || ioProxy;

export type ContextType = "text" | "gmail";

/**
 * Suggestion metadata
 */
export interface SuggestionMeta {
  suggestion: string;
  userAdded: boolean;
  type: string;
}

/**
 * Reply metadata
 */
export interface ReplyMeta {
  prompt: string;
  suggestions: string[];
  type: string;
}

export interface SuggestionsResponse {
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
export default class PointApi {
  /** Email address of Point user */
  public readonly emailAddress: string;
  /** Auth Code key of Point client */
  public readonly authCode: string;
  /** @private SocketIO instance used to interact with Point API */
  private socket: SocketIOClient.Socket;

  /**
   * @param  emailAddress Email address of Point user
   * @param  authCode Auth code of Point client
   */
  constructor(emailAddress: string, authCode: string, keywordSearch = false) {
    this.emailAddress = emailAddress;
    this.authCode = authCode;
    this.socket = io("https://dev.pointapi.com", {
      query: {
        emailAddress: this.emailAddress,
        keywordSearch
      },
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: "Bearer " + this.authCode
          }
        }
      }
    });
  }
  /**
   *  Query PointApi with seed text to get predicted suggestions
   * @param seedText The text to base suggestion predictions off of
   * @returns A list of the predicted suggestion objects
   */
  public autocomplete(
    seedText: string,
    currentContext?: string
  ): Promise<SuggestionsResponse | null> {
    return new Promise(resolve => {
      this.socket.emit(
        "suggestions",
        { seedText: seedText.trim(), currentContext },
        (response: SuggestionsResponse) => {
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
    suggestion: SuggestionMeta,
    type: "positive" | "negative"
  ): Promise<void> {
    this.socket.emit(
      "feedback",
      { responseId, suggestion, type },
      (response: { timestamp: string; status: string }) => {
        if (!response || response.status !== "success") {
          throw new Error("Could not record feedback");
        }
      }
    );
  }
  /**
   *  Set the context of the autocomplete session
   */
  public setContext(
    pastContext: string,
    contextType: ContextType = "text"
  ): Promise<string> {
    return new Promise(resolve => {
      this.socket.emit(
        "set-context",
        { pastContext, contextType },
        (response: { timestamp: string; status: string }) => {
          resolve(response.status);
        }
      );
    });
  }
  /**
   *  Get reply suggestions given some recieved text
   */
  public reply(
    pastContext: string,
    contextType: ContextType = "text"
  ): Promise<ReplyResponse | null> {
    return new Promise(resolve => {
      this.socket.emit(
        "reply",
        { pastContext, contextType },
        (response: ReplyResponse) => {
          if (!response || !response.replies || !response.replies.length) {
            resolve(null);
          }
          resolve(response);
        }
      );
    });
  }
}

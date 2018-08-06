import * as io from "socket.io-client";
/**
 * Suggestion metadata
 */
export interface SuggestionMeta {
  suggestion: string;
  userAdded: boolean;
  type: string;
}

interface SocketResponse {
  suggestions: SuggestionMeta[];
  seedText: string;
  messageId: string;
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
    this.socket = io("https://v1.pointapi.com", {
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
  public searchSuggestions(
    seedText: string,
    currentContext?: string
  ): Promise<SuggestionMeta[] | null> {
    return new Promise(resolve => {
      this.socket.emit(
        "suggestions",
        { seedText: seedText.trim(), currentContext },
        (response: SocketResponse) => {
          if (!response) {
            resolve(null);
          }
          const { suggestions } = response;
          if (!suggestions || !suggestions.length) {
            resolve(null);
          }
          resolve(suggestions);
        }
      );
    });
  }

  /**
   *  Tell the PointApi what suggestion was chosen to improve its model
   */
  public async reportChosenSuggestion(
    seedText: string,
    displayedSuggestions: SuggestionMeta[],
    chosenSuggestion: SuggestionMeta,
    currentContext: string
  ): Promise<void> {
    this.socket.emit(
      "chosen-suggestions",
      { seedText, displayedSuggestions, chosenSuggestion, currentContext },
      (response: { timestamp: string; status: string }) => {
        if (!response || response.status !== "success") {
          throw new Error("Could not recore chosen suggestion");
        }
      }
    );
  }
  /**
   *  Set the context of the autocomplete session
   */
  public setContext(pastContext: string, contextType: string): Promise<string> {
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
}

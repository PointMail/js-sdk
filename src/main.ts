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
  /** API key of Point client */
  public readonly apiKey: string;
  /** @private SocketIO instance used to interact with Point API */
  private socket: SocketIOClient.Socket;

  /**
   * @param  emailAddress Email address of Point user
   * @param  apiKey API key of Point client
   */
  constructor(emailAddress: string, apiKey: string) {
    this.emailAddress = emailAddress;
    this.apiKey = apiKey;
    this.socket = io(
      "http://ec2-34-220-119-185.us-west-2.compute.amazonaws.com",
      {
        query: {
          emailAddress: "przxmek@gmail.com"
        },
        transportOptions: {
          polling: {
            extraHeaders: {
              Authorization: "Basic " + this.apiKey
            }
          }
        }
      }
    );
  }
  /**
   *  Query PointApi with seed text to get predicted suggestions
   * @param seedText The text to base suggestion predictions off of
   * @returns A list of the predicted suggestion objects
   */
  public searchSuggestions(seedText: string): Promise<SuggestionMeta[] | null> {
    return new Promise(resolve => {
      if (!seedText) resolve(null);
      const trimmedText = seedText.trim();
      if (!trimmedText) resolve(null);
      this.socket.emit(
        "suggestions",
        { seedText: trimmedText, messageId: "15569f2b0198e387" },
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
}

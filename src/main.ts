import * as io from "socket.io-client";

// const ROOT_URI = "https://alpha-autocomplete.easyemail.ai";

/**
 * Suggestion metadata
 */
export type SuggestionMeta = {
  suggestion: string;
  userAdded: boolean;
  type: string;
};

type SocketResponse = {
  suggestions: Array<SuggestionMeta>;
  seedText: string;
  messageId: string;
};

/**
 * Point Websockets Api Instance
 */
export class PointApi {
  /** Email address of Point user */
  emailAddress: string;
  /** API key of Point client */
  apiKey: string;
  /** List of suggestions recieved from last query */
  suggestions: Array<SuggestionMeta>;
  /** @private SocketIO instance used to interact with Point API*/
  socket: SocketIOClient.Socket;

  /**
   * @param  emailAddress Email address of Point user
   * @param  apiKey API key of Point client
   */
  constructor(emailAddress: string, apiKey: string) {
    this.emailAddress = emailAddress;
    this.apiKey = apiKey;
    this.suggestions = [];
    this.socket = io(
      // "http://dev-api-autocomplete.us-west-2.elasticbeanstalk.com",
      "localhost:5000/socket.io",
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
    this.socket.on("connect", () => {
      console.log("connected");
      this.searchSuggestions("How");
    });
  }
  /**
   *  Query PointApi with seed text to get predicted suggestions
   * @param seedText The text to base suggestion predictions off of
   * @returns A list of the predicted suggestion objects
   */
  searchSuggestions(seedText: string): Promise<Array<SuggestionMeta> | null> {
    return new Promise(resolve => {
      if (!seedText || !seedText.trim()) {
        resolve(null);
      }
      console.log("emit seedText: " + seedText);
      this.socket.emit(
        "suggestions",
        { seedText: seedText },
        (response: SocketResponse) => {
          console.log(response);
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

//@flow
import io from "socket.io-client";
import type { Socket } from "socket.io-client";

const ROOT_URI = "https://alpha-autocomplete.easyemail.ai";

export type SuggestionMeta = {
  suggestion: string,
  userAdded: boolean,
  type: string
};

class PointApi {
  emailAddress: string;
  apiKey: string;
  suggestions: Array<SuggestionMeta>;
  socket: Socket;

  constructor(emailAddress: string, apiKey: string) {
    this.emailAddress = emailAddress;
    this.apiKey = apiKey;
    this.suggestions = [];
    this.socket = io(
      "http://dev-api-autocomplete.us-west-2.elasticbeanstalk.com",
      {
        query: {
          emailAddress: "przxmek@gmail.com"
        },
        transportOptions: {
          polling: {
            extraHeaders: {
              Authorization: "Basic " + this.apiKey,
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Credentials": "true",
              "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,OPTIONS",
              "Access-Control-Allow-Headers":
                "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json,Authorization"
            }
          }
        }
      }
    );
  }

  searchSuggestions(query: string): Promise<?Array<SuggestionMeta>> {
    return new Promise(resolve => {
      if (!query || !query.trim()) {
        resolve(null);
      }
      this.socket.emit("suggestions", { seedText: query }, suggestions => {
        if (!suggestions || !suggestions.length) {
          resolve(null);
        }
        resolve(suggestions);
      });
    });
  }
}

export default PointApi;

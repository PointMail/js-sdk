"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io = require("socket.io-client");
/**
 * Point Websockets Api Instance
 */
class PointApi {
    /**
     * @param  emailAddress Email address of Point user
     * @param  apiKey API key of Point client
     */
    constructor(emailAddress, apiKey) {
        this.emailAddress = emailAddress;
        this.apiKey = apiKey;
        this.suggestions = [];
        this.socket = io(
        // "http://dev-api-autocomplete.us-west-2.elasticbeanstalk.com",
        "localhost:5000/socket.io", {
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
        });
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
    searchSuggestions(seedText) {
        return new Promise(resolve => {
            if (!seedText || !seedText.trim()) {
                resolve(null);
            }
            console.log("emit seedText: " + seedText);
            this.socket.emit("suggestions", { seedText: seedText }, (response) => {
                console.log(response);
                if (!response) {
                    resolve(null);
                }
                const { suggestions } = response;
                if (!suggestions || !suggestions.length) {
                    resolve(null);
                }
                resolve(suggestions);
            });
        });
    }
}
exports.PointApi = PointApi;
//# sourceMappingURL=main.js.map
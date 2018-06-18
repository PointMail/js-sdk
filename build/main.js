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
        this.socket = io("http://ec2-34-220-119-185.us-west-2.compute.amazonaws.com", {
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
    }
    /**
     *  Query PointApi with seed text to get predicted suggestions
     * @param seedText The text to base suggestion predictions off of
     * @returns A list of the predicted suggestion objects
     */
    searchSuggestions(seedText) {
        return new Promise(resolve => {
            if (!seedText)
                resolve(null);
            const trimmedText = seedText.trim();
            if (!trimmedText)
                resolve(null);
            this.socket.emit("suggestions", { seedText: trimmedText, messageId: "15569f2b0198e387" }, (response) => {
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
exports.default = PointApi;
//# sourceMappingURL=main.js.map
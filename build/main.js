"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io = require("socket.io-client");
/**
 * Point Websockets Api Instance
 */
class PointApi {
    /**
     * @param  emailAddress Email address of Point user
     * @param  authCode API key of Point client
     */
    constructor(emailAddress, authCode) {
        this.emailAddress = emailAddress;
        this.authCode = authCode;
        this.socket = io("dev-api-autocomplete-docker2.n3sazrwma3.us-west-2.elasticbeanstalk.com", {
            query: {
                emailAddress: this.emailAddress
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
    searchSuggestions(seedText, currentContext) {
        return new Promise(resolve => {
            if (!seedText)
                resolve(null);
            const trimmedText = seedText.trim();
            if (!trimmedText)
                resolve(null);
            this.socket.emit("suggestions", { seedText: trimmedText, currentContext }, (response) => {
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
    /**
     *  Tell the PointApi what suggestion was chosen to improve its model
     */
    async reportChosenSuggestion(seedText, displayedSuggestions, chosenSuggestion, currentContext) {
        this.socket.emit("chosen-suggestions", { seedText, displayedSuggestions, chosenSuggestion, currentContext }, (response) => {
            if (!response || response.status !== "success") {
                throw new Error("Could not recore chosen suggestion");
            }
        });
    }
    /**
     *  Set the context of the autocomplete session
     */
    async setContext(pastContext, contextType) {
        this.socket.emit("set-context", { pastContext, contextType });
    }
}
exports.default = PointApi;
//# sourceMappingURL=main.js.map
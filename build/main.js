"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io = require("socket.io-client");
/**
 * Point Websockets Api Instance
 */
class PointApi {
    /**
     * @param  emailAddress Email address of Point user
     * @param  authCode Auth code of Point client
     */
    constructor(emailAddress, authCode, keywordSearch = false) {
        this.emailAddress = emailAddress;
        this.authCode = authCode;
        this.socket = io("localhost:5000", {
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
    searchSuggestions(seedText, currentContext) {
        return new Promise(resolve => {
            this.socket.emit("suggestions", { seedText: seedText.trim(), currentContext }, (response) => {
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
    setContext(pastContext, contextType) {
        return new Promise(resolve => {
            this.socket.emit("set-context", { pastContext, contextType }, (response) => {
                resolve(response.status);
            });
        });
    }
    /**
     *  Get reply suggestions given some recieved text
     */
    getReplies(pastContext, contextType) {
        return new Promise(resolve => {
            this.socket.emit("reply", { pastContext, contextType }, (response) => {
                if (!response) {
                    resolve(null);
                }
                const { replies } = response;
                if (!replies || !replies.length) {
                    resolve(null);
                }
                resolve(replies);
            });
        });
    }
}
exports.default = PointApi;
//# sourceMappingURL=main.js.map
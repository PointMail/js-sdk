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
        this.socket = io(
        // "http://ec2-34-220-119-185.us-west-2.compute.amazonaws.com",
        "localhost:5000", {
            query: {
                emailAddress: "przxmek@gmail.com"
            },
            transportOptions: {
                polling: {
                    extraHeaders: {
                        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MjkzNjIwNTgsIm5iZiI6MTUyOTM2MjA1OCwiZXhwIjoxNTI5MzY1NjU4LCJzdWIiOnsidXNlci5pZCI6MiwiZW1haWwiOiJwcnp4bWVrQGdtYWlsLmNvbSIsImtleV9pZCI6MX19.XBI_cuabfTpfA9UKLglPY9KYF18VIGI_Iqeiz8sIFSk"
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
            this.socket.emit("suggestions", { seedText: trimmedText }, (response) => {
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
            if (!response || response !== "success") {
                throw new Error("Could not recore chosen suggestion");
            }
        });
    }
    /**
     *  Set the context of the autocomplete session
     */
    setContext(pastContext, contextType) {
        this.socket.emit("set-context", { pastContext, contextType });
    }
}
exports.default = PointApi;
//# sourceMappingURL=main.js.map
/// <reference types="socket.io-client" />
/**
 * Suggestion metadata
 */
export declare type SuggestionMeta = {
    suggestion: string;
    userAdded: boolean;
    type: string;
};
/**
 * Point Websockets Api Instance
 */
export declare class PointApi {
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
    constructor(emailAddress: string, apiKey: string);
    /**
     *  Query PointApi with seed text to get predicted suggestions
     * @param seedText The text to base suggestion predictions off of
     * @returns A list of the predicted suggestion objects
     */
    searchSuggestions(seedText: string): Promise<Array<SuggestionMeta> | null>;
}

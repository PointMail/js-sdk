/**
 * Suggestion metadata
 */
export interface SuggestionMeta {
    suggestion: string;
    userAdded: boolean;
    type: string;
}
/**
 * Point Websockets Api Instance
 */
export default class PointApi {
    /** Email address of Point user */
    readonly emailAddress: string;
    /** API key of Point client */
    readonly apiKey: string;
    /** @private SocketIO instance used to interact with Point API */
    private socket;
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
    searchSuggestions(seedText: string): Promise<SuggestionMeta[] | null>;
}

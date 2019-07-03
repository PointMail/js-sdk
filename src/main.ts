import AutocompleteSession from "./ApiModules/autocompleteSession";
import PointApiBase from "./pointApiBase";
import AuthManager from "./authManager";

export interface ErrorResponse {
  error: string;
}

/**
 * Point Api Instance
 */
export default class PointApi extends PointApiBase {
  private authManager: AuthManager;

  /**
   *
   * @param emailAddress Email address of Point user account
   * @param apiKey User's API Key
   * @param apiUrl Point API URL
   */
  constructor(
    emailAddress: string,
    apiKey: string,
    apiUrl: string = "https://v1.pointapi.com"
  ) {
    super(emailAddress, apiUrl);

    this.authManager = new AuthManager(emailAddress, apiKey, apiUrl);
  }

  public setCredentials(emailAddress: string, apiKey: string) {
    this.emailAddress = emailAddress;
    this.authManager.setCredentials(emailAddress, apiKey);
  }

  /**
   * @deprecated Please use initAutocompleteSessionAsync() method instead.
   * 
   * Initializes a new autocomplete session. 
   * This method doesn't track if the session has finished connection init.
   * 
   * @param searchType how to search for matching suggestions (standard, keyword, hybdrid)
   */
  public initAutocompleteSession(
    searchType: string
  ): AutocompleteSession {
    const session = new AutocompleteSession(
      this.emailAddress,
      this.authManager,
      searchType,
      this.apiUrl
    );

    session.reconnect();

    return session;
  }


  /** 
   * Initializes a new autocomplete session. A promise will return if connection is successfully made.
   * 
   * @param searchType how to search for matching suggestions (standard, keyword, hybdrid)
   */
  public async initAutocompleteSessionAsync(
    searchType: string
  ): Promise<AutocompleteSession> {
    const session = new AutocompleteSession(
      this.emailAddress,
      this.authManager,
      searchType,
      this.apiUrl
    );

    await session.reconnect();

    return session;
  }

  /**
   * Fetches the URL from the server endpoint.
   * 
   * @param method HTTP method type
   * @param url Endpoint URL (e.g. /auth or /account)
   * @param data Payload for the body of the request (e.g. in POST)
   * @param headers Headers to add to the request
   */
  public async authFetch(
    method: string,
    url: string,
    data?: object,
    headers?: object,
  ) {
    const jwt = await this.authManager.getJwt();

    const authHeaders = {
      Authorization: `Bearer ${jwt}`,
      ...headers
    };

    return super.authFetch(method, url, data, authHeaders);
  }
}

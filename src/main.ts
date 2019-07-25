import AccountApiModule from "./ApiModules/account";
import AutocompleteSessionImpl, { AutocompleteSession } from "./ApiModules/autocompleteSession";
import CustomSuggestionsApiModule from "./ApiModules/customSuggestions";
import InteractionsApiModule from "./ApiModules/interactions";
import AuthManagerImpl, { AuthManager } from "./authManager";

export interface ErrorResponse {
  error: string;
}

/**
 * Point API base interface
 */
export interface PointApi {
  /** Email address of Point user account */
  emailAddress: string;

  /** Point API URL */
  readonly apiUrl: string;

  /**
   * API submodules
   */
  readonly account: AccountApiModule;
  readonly customSuggestions: CustomSuggestionsApiModule;
  readonly interactions: InteractionsApiModule;

  setCredentials: (emailAddress: string, apiKey: string) => void;

  initAutocompleteSession: (searchType: string) => AutocompleteSession;
  initAutocompleteSessionAsync: (searchType: string) => Promise<AutocompleteSession>;

  authFetch: (
    method: string,
    url: string,
    data?: object,
    headers?: Record<string, string>,
  ) => Promise<Response>;

  fetch: (
    method: string,
    url: string,
    data?: object,
    headers?: Record<string, string>
  ) => Promise<Response>;
}


/**
 * Point Api Instance
 */
export default class PointApiImpl implements PointApi {
  /** Email address of Point user account */
  public emailAddress: string;

  /** Point API URL */
  public readonly apiUrl: string;

  public readonly account: AccountApiModule;
  public readonly customSuggestions: CustomSuggestionsApiModule;
  public readonly interactions: InteractionsApiModule;

  /** Point API version */
  private readonly ApiVersionAccept: string = 'application/vnd.point.v1';

  private readonly authManager: AuthManager;

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
    this.emailAddress = emailAddress;
    this.apiUrl = apiUrl;

    // Init API submodules
    this.account = new AccountApiModule(this);
    this.customSuggestions = new CustomSuggestionsApiModule(this);
    this.interactions = new InteractionsApiModule(this);

    this.authManager = new AuthManagerImpl(emailAddress, apiKey, apiUrl, this.ApiVersionAccept);
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
    const session = new AutocompleteSessionImpl(
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
    const session = new AutocompleteSessionImpl(
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

    return this.fetch(method, url, data, authHeaders);
  }

  public async fetch(
    method: string,
    url: string,
    data?: object,
    headers?: Record<string, string>
  ) {
    const { ApiVersionAccept, emailAddress, apiUrl } = this;
    
    const body = data ? JSON.stringify(data) : undefined;
    const fullUrl = `${apiUrl}${url}?emailAddress=${emailAddress}`;

    const requestHeaders = {
      Accept: ApiVersionAccept,
      ...headers
    };

    const response = await fetch(fullUrl, {
      method,
      body,
      headers: requestHeaders,
      credentials: "include"
    });

    return response;
  }
}

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
    this.authManager.setCredentials(emailAddress, apiKey);
  }

  public async initAutocompleteSession(
    searchType: string = "standard"
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

  public async authFetch(
    method: string,
    url: string,
    data?: object,
    headers?: object
  ) {
    const jwt = await this.authManager.getJwt();

    const authHeaders = {
      Authorization: `Bearer ${jwt}`,
      ...headers
    };
    return super.authFetch(method, url, data, authHeaders);
  }
}

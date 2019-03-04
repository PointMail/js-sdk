import AutocompleteSession from "./ApiModules/autocompleteSession";
import PointApiBase from "./pointApiBase";

export interface ErrorResponse {
  error: string;
}

/**
 * Point Api Instance
 */
export default class PointApi extends PointApiBase {
  /** User's API Key */
  private apiKey: string;

  /** Active JWT */
  private jwt: string | null;
  private jwtRenewTimeoutId: NodeJS.Timer;

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
    this.apiKey = apiKey;

    this.jwt = null;

    this.refreshJwtToken();
  }

  public setCredentials(emailAddress: string, apiKey: string) {
    this.emailAddress = emailAddress;
    this.apiKey = apiKey;

    this.jwt = null;
    if (this.jwtRenewTimeoutId) {
      clearTimeout(this.jwtRenewTimeoutId);
    }

    this.refreshJwtToken();
  }

  public initAutocompleteSession(
    searchType: string = "standard"
  ): AutocompleteSession {
    if (!this.jwt) {
      this.refreshJwtToken();
    }

    return new AutocompleteSession(
      this.emailAddress,
      () => this.jwt as string,
      searchType,
      this.apiUrl
    );
  }

  public async authFetch(
    method: string,
    url: string,
    data?: object,
    headers?: object
  ) {
    if (!this.jwt) {
      await this.refreshJwtToken();
    }

    const { jwt } = this;

    const authHeaders = {
      Authorization: `Bearer ${jwt}`,
      ...headers
    };
    return super.authFetch(method, url, data, authHeaders);
  }

  public async refreshJwtToken(autoRenew: boolean = true) {
    const { emailAddress, apiUrl, apiKey } = this;
    const response = await (await fetch(
      `${apiUrl}/auth?emailAddress=${emailAddress}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`
        },
        method: "POST"
      }
    )).json();

    this.jwt = await response.jwt;

    if (autoRenew) {
      if (this.jwtRenewTimeoutId) {
        clearTimeout(this.jwtRenewTimeoutId);
      }

      // Renew JWT 5 seconds before it's exipration
      this.jwtRenewTimeoutId = setTimeout(async () => {
        await this.refreshJwtToken();
      }, response.expiresAt - Date.now() - 5000);
    }
  }
}

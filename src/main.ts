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
  }

  public setCredentials(emailAddress: string, apiKey: string) {
    this.emailAddress = emailAddress;
    this.apiKey = apiKey;

    this.jwt = null;
    if (this.jwtRenewTimeoutId) {
      clearInterval(this.jwtRenewTimeoutId);
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

  public async refreshJwtToken(autoRenew: boolean = true, retryCount: number = 0) {
    const { emailAddress, apiUrl, apiKey } = this;

    try {
      const response = await fetch(
        `${apiUrl}/auth?emailAddress=${emailAddress}`,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`
          },
          method: "POST",
          credentials: "include"
        }
      );

      if (response.ok) {
        const responseJson = await response.json();

        this.jwt = await responseJson.jwt;

        if (autoRenew) {
          if (this.jwtRenewTimeoutId) {
            clearInterval(this.jwtRenewTimeoutId);
          }

          // Renew JWT 5 seconds before it's exipration
          this.jwtRenewTimeoutId = setInterval(async () => {
            clearInterval(this.jwtRenewTimeoutId);
            await this.refreshJwtToken();
          }, responseJson.expiresAt - Date.now() - 5000);
        }
      } else {
        // Server returned an error
        if (response.status >= 500 && retryCount < 10) {
          // Retry /auth after some delay
          const delay = Math.pow(2, retryCount) * 500;
          await new Promise(r => setTimeout(r, delay))
          await this.refreshJwtToken(true, retryCount + 1);
        }
      }
    } catch (e) {
      if (retryCount < 10) {
        // Retry /auth after some delay
        const delay = Math.pow(2, retryCount) * 500;
        await new Promise(r => setTimeout(r, delay));
        await this.refreshJwtToken(true, retryCount + 1);
      }
    }
  }
}

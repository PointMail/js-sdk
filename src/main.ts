import CustomSuggestionsApiModule from "./ApiModules/customSuggestions";
import AutocompleteSession from "./ApiModules/autocompleteSession";
import InteractionsApiModule from "./ApiModules/interactions";

export interface ErrorResponse {
  error: string;
}

export interface Account {
  name: string;
  emailAddress: string;
  subscription: Subscription;
}

export interface Subscription {
  membershipType: string;
  isActive: boolean;
  expirationDate: number | null;
}

/**
 * Point Websockets Api Instance
 */
export default class PointApi {
  /** Email address of Point user account */
  public emailAddress: string;

  /** Point API URL */
  public readonly apiUrl: string;

  public readonly customSuggestions: CustomSuggestionsApiModule;
  public readonly interactions: InteractionsApiModule;

  public account: Account;

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
    this.emailAddress = emailAddress;
    this.apiKey = apiKey;
    this.apiUrl = apiUrl;

    this.jwt = null;

    // Init API submodules
    this.customSuggestions = new CustomSuggestionsApiModule(this);
    this.interactions = new InteractionsApiModule(this);

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

  public async getAccountInfo(): Promise<Account> {
    if (!this.jwt) {
      await this.refreshJwtToken();
    }

    return this.account;
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

  public async authFetch(method: string, url: string, data?: object, headers?: object) {
    if (!this.jwt) {
      await this.refreshJwtToken();
    }

    const { emailAddress, apiUrl, jwt } = this;
    const body = data ? JSON.stringify(data) : undefined;
    const fullUrl = `${apiUrl}${url}?emailAddress=${emailAddress}`;

    const response = await fetch(fullUrl, {
      method,
      body,
      headers: {
        Authorization: `Bearer ${jwt}`,
        ...headers
      }
    });

    return response;
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
    this.account = {
      name: await response.name,
      emailAddress: await response.emailAddress,
      subscription: await response.subscription
    };

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

import CustomSuggestionsApiModule from "./ApiModules/customSuggestions";
import InteractionsApiModule from "./ApiModules/interactions";
import { Account } from "./ApiModules/account";
import AccountApiModule from "./ApiModules/account";

/**
 * Point API instance without authorization manager.
 */
export default class PointApiBase {
  /** Email address of Point user account */
  public emailAddress: string;

  /** Point API URL */
  public readonly apiUrl: string;

  public readonly account: AccountApiModule;
  public readonly customSuggestions: CustomSuggestionsApiModule;
  public readonly interactions: InteractionsApiModule;

  /**
   *
   * @param emailAddress Email address of Point user account
   * @param apiKey User's API Key
   * @param apiUrl Point API URL
   */
  constructor(
    emailAddress: string,
    apiUrl: string = "https://v1.pointapi.com"
  ) {
    this.emailAddress = emailAddress;
    this.apiUrl = apiUrl;

    // Init API submodules
    this.account = new AccountApiModule(this);
    this.customSuggestions = new CustomSuggestionsApiModule(this);
    this.interactions = new InteractionsApiModule(this);
  }

  public async getAccountInfo(): Promise<Account> {
    // getAccountInfo() is deprecated. Use account.get()
    return (await this.authFetch("GET", "/account")).json();
  }

  public async authFetch(
    method: string,
    url: string,
    data?: object,
    headers?: Record<string, string>
  ) {
    return this.fetch(method, url, data, headers);
  }

  public async fetch(
    method: string,
    url: string,
    data?: object,
    headers?: Record<string, string>
  ) {
    const { emailAddress, apiUrl } = this;
    const body = data ? JSON.stringify(data) : undefined;
    const fullUrl = `${apiUrl}${url}?emailAddress=${emailAddress}`;

    const response = await fetch(fullUrl, {
      method,
      body,
      headers,
      credentials: "include"
    });

    return response;
  }
}

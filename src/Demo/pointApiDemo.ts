import AccountApiModule from "../ApiModules/account";
import { AutocompleteSession } from "../ApiModules/autocompleteSession";
import CustomSuggestionsApiModule from "../ApiModules/customSuggestions";
import InteractionsApiModule from "../ApiModules/interactions";
import { AuthManager } from "../authManager";
import { PointApi } from "../main";
import AuthManagerDummy from "./authManagerDummy";
import AutocompleteDemoSession from "./autocompleteDemoSession";
import LocalApiServer from "./localApiServer";

export default class PointApiDemo implements PointApi {
  /** Email address of Point user account */
  public emailAddress: string;

  /** Point API URL */
  public readonly apiUrl: string;

  public readonly account: AccountApiModule;
  public readonly customSuggestions: CustomSuggestionsApiModule;
  public readonly interactions: InteractionsApiModule;

  private readonly server: LocalApiServer;

  private authManager: AuthManager;

  constructor(
    emailAddress: string,
  ) {
    this.emailAddress = emailAddress;
    this.apiUrl = "demo";

    // Init API submodules
    this.account = new AccountApiModule(this);
    this.customSuggestions = new CustomSuggestionsApiModule(this);
    this.interactions = new InteractionsApiModule(this);

    this.authManager = new AuthManagerDummy();
    this.server = new LocalApiServer();
  }

  public setCredentials(emailAddress: string, apiKey: string) {
    this.emailAddress = emailAddress;
    this.authManager.setCredentials(emailAddress, apiKey);
  }

  public initAutocompleteSession(
    searchType: string
  ): AutocompleteSession {
    return new AutocompleteDemoSession(this.server);
  }

  public async initAutocompleteSessionAsync(
    searchType: string
  ): Promise<AutocompleteSession> {
    const autocompleteDummySession = this.initAutocompleteSession(searchType);
    return Promise.resolve(autocompleteDummySession);
  }

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
    const response = this.server.httpRequest(method, url, data, headers);
    return Promise.resolve(response);
  }
}

import { PointApi } from "../main";

export type SearchType = "standard" | "keyword" | "hybrid";

export interface Account {
  emailAddress: string;
  name: string;
  preferences: Preferences;
  subscription: Subscription;
}

export interface Website {
  urls: string[];
  displayName: string;
  dropdownEnabled: boolean;
  usesReact: boolean;
}

export interface Preferences {
  searchType: SearchType;
  tabCompletion: boolean;
  websites: Website[];
  snippetMenuEverywhere: boolean;
}

export type Preference =
  { field: 'search_type', value: 'standard' | 'keyword' | 'hybrid' } |
  { field: 'tab_completion', value: boolean } |
  { field: 'facebook_dropdown', value: boolean } |
  { field: 'zendesk_dropdown', value: boolean } |
  { field: 'menu_everywhere', value: boolean };

export interface Subscription {
  dailyLimit: number | null;
  dailyUsage: number;
  expirationDate: number | null;
  membershipType: string;
  willRenew: boolean;
}

/** Class to manage user's Account */
export default class AccountApiModule {
  private readonly api: PointApi;

  private readonly url: string = "/account";

  constructor(api: PointApi) {
    this.api = api;
  }

  public async get(): Promise<Account> {
    return (await this.authFetch("GET")).json();
  }

  public async setPreference(preference: Preference): Promise<Response> {
    return this.authFetch("PUT", preference);
  }

  /** Make authenticated request to interactions api */
  private authFetch(method: string, data?: object): Promise<Response> {
    const headers = {
      "Content-Type": "application/json"
    };
    return this.api.authFetch(method, this.url, data, headers);
  }
}

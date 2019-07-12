import PointApiBase from "../pointApiBase";

export type SearchType = "standard" | "keyword" | "hybrid";

export interface Account {
  emailAddress: string;
  name: string;
  preferences: Preferences;
  subscription: Subscription;
}

export interface Website {
  urls: string[],
  displayName: string,
  dropdownEnabled: boolean
}

export interface Preferences {
  searchType: SearchType;
  tabCompletion: boolean;
  websites: Website[];
  snippetMenuEverywhere: boolean;
}

export interface Subscription {
  dailyLimit: number | null;
  dailyUsage: number;
  expirationDate: number | null;
  membershipType: string;
  willRenew: boolean;
}

/** Class to manage user's Account */
export default class AccountApiModule {
  private readonly api: PointApiBase;

  private readonly url: string = "/account";

  constructor(api: PointApiBase) {
    this.api = api;
  }

  public async get(): Promise<Account> {
    return (await this.authFetch("GET")).json();
  }

  public async setPreference(field:string, newValue:string): Promise<Response> {
    return this.authFetch("PUT", { 'field': field, 'newValue': newValue });
  }

  /** Make authenticated request to interactions api */
  private authFetch(method: string, data?: object): Promise<Response> {
    const headers = {
      "Content-Type": "application/json"
    };
    return this.api.authFetch(method, this.url, data, headers);
  }
}

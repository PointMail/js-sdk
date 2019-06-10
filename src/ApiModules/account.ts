import PointApiBase from "../pointApiBase";

export type SearchType = "standard" | "keyword" | "hybrid";

export interface Account {
  emailAddress: string;
  name: string;
  preferences: Preferences;
  subscription: Subscription;
}

export interface Preferences {
  searchType: SearchType;
  tabCompletion: boolean;
}

export interface Subscription {
  expirationDate: number | null;
  isActive: boolean;
  membershipType: string;
  willRenew: boolean;
  submittedPaymentInfo: boolean;
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

  public async setPreferences(preferences: Preferences): Promise<Response> {
    return this.authFetch("PUT", { preferences });
  }

  /** Make authenticated request to interactions api */
  private authFetch(method: string, data?: object): Promise<Response> {
    const headers = {
      "Content-Type": "application/json"
    };
    return this.api.authFetch(method, this.url, false, data, headers);
  }
}

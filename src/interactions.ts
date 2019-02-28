import PointApi from "src";

/** Result containing just a status field */
export interface StatusResponse {
  status: string;
}

/** Class to keep track of api credentials and make requests to the custom suggestions api */
export default class InteractionsApiModule {
  private readonly api: PointApi;

  private readonly url: string = "/interactions";

  constructor(api: PointApi) {
    this.api = api;
  }

  public async emailSent() : Promise<StatusResponse> {
      return this.authFetch("POST", {})
  }

  /** Make authenticated request to custom suggestions api */
  private async authFetch(method: string, data?: object) {
    return (await this.api.authFetch(method, this.url, data)).json();
  }
}

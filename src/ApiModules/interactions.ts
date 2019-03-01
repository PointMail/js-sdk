import PointApiBase from "../pointApiBase";

/** Result containing just a status field */
export interface StatusResponse {
  status: string;
}

/** Class to keep track of api credentials and make requests to the custom suggestions api */
export default class InteractionsApiModule {
  private readonly api: PointApiBase;

  private readonly url: string = "/interactions";

  constructor(api: PointApiBase) {
    this.api = api;
  }

  public async draftDiscarded() {
    this.storeInteraction("draftDiscarded");
  }

  public async emailSent(messageId: string) {
    this.storeInteraction("emailSent", { messageId });
  }

  private async storeInteraction(type: string, data?: object) {
    this.authFetch("POST", { type, data });
  }

  /** Make authenticated request to interactions api */
  private async authFetch(method: string, data?: object) {
    const headers = {
      "Content-Type": "application/json"
    };
    await this.api.authFetch(method, this.url, data, headers);
  }
}

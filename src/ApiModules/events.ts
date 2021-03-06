/** Class to record Events (interactions with no connected user's account) */
export default class EventsApiModule {
  /** Point API URL */
  public readonly apiUrl: string;

  private readonly emailAddress: string = "";

  private readonly url: string = "/events";

  constructor(apiUrl: string = "https://v1.pointapi.com", emailAddress?: string) {
    this.apiUrl = apiUrl;

    if (emailAddress) {
      this.emailAddress = emailAddress;
    }
  }

  public async scribeInstalled(id: string) {
    await this.storeEvent("scribeInstalled", id);
  }

  public async scribeUninstalled(id: string) {
    await this.storeEvent("scribeUninstalled", id);
  }

  public async acceptedToS(id: string) {
    await this.storeEvent("acceptedToS", id);
  }

  public async signInWithGoogle(id: string) {
    await this.storeEvent("signInWithGoogle", id);
  }

  public async paymentInfoFreeTrialShown(id: string) {
    await this.storeEvent("paymentInfoFreeTrialShown", id);
  }

  public async paymentFailure(id: string) {
    await this.storeEvent("paymentFailure", id);
  }

  public async paymentOpened(id: string) {
    await this.storeEvent("paymentOpened", id);
  }

  public async paymentSuccess(id: string) {
    await this.storeEvent("paymentSuccess", id);
  }

  private async storeEvent(type: string, trackingId: string, data?: object) {
    const headers = {
      "Content-Type": "application/json"
    };

    const payload = { type, trackingId, data };

    if (this.emailAddress) {
      payload["emailAddress"] = this.emailAddress;
    }

    await this.fetch("POST", payload, headers);
  }

  /** Make unauthenticated request to Events API Resource */
  private async fetch(
    method: string,
    data?: object,
    headers?: Record<string, string>
  ) {
    const { apiUrl, url } = this;
    const fullUrl = `${apiUrl}${url}`;

    const body = data ? JSON.stringify(data) : undefined;

    const response = await fetch(fullUrl, {
      method,
      body,
      headers
    });

    return response;
  }
}

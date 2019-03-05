/** Class to record Events (interactions with no connected user's account) */
export default class EventsApiModule {
  /** Point API URL */
  public readonly apiUrl: string;

  private readonly url: string = "/events";

  constructor(apiUrl: string = "https://v1.pointapi.com") {
    this.apiUrl = apiUrl;
  }

  public async scribeInstalled(id: string) {
    this.storeEvent("scribeInstalled", { id });
  }

  public async scribeUninstalled(id: string) {
    this.storeEvent("scribeUninstalled", { id });
  }

  private async storeEvent(type: string, data?: object) {
    const headers = {
      "Content-Type": "application/json"
    };
    this.fetch("POST", { type, data }, headers);
  }

  /** Make unauthenticated request to events api */
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

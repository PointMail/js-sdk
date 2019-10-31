import { PointApi } from "../main";
import { Snippet } from "./autocompleteSession";

/** Result of a GET request to api */
export interface GetResponse {
  snippets: Snippet[];
}

/** Result containing just a status field */
interface StatusResponse {
  status: string;
}


/** Class to keep track of api credentials and make requests to the custom suggestions api */
export default class SnippetApiModule {
  private readonly api: PointApi;

  private readonly url: string = "/snippets";

  constructor(api: PointApi) {
    this.api = api;
  }

  /** Get custom suggestions and hotkeys */
  public async get(): Promise<GetResponse> {
    return this.authFetch("GET");
  }

  /** Delete a custom suggestion or hotkey */
  public async delete(
    snippetId: string,
  ): Promise<StatusResponse> {
    return this.authFetch("DELETE", { snippetId });
  }

  public async edit(
    snippetId: string,
    newContent: string,
    newName: string,
    labels: string[]
  ): Promise<StatusResponse> {
    return this.authFetch("PUT", { snippetId, newContent, newName, labels });
  }

  /** Add a custom suggestion or hotkey */
  public async add(
    content: string,
    name: string,
    labels: string[]
  ): Promise<StatusResponse> {
    return this.authFetch("POST", { name, content, labels });
  }

  /** Make authenticated request to custom suggestions api */
  private async authFetch(method: string, data?: object) {
    return (await this.api.authFetch(method, this.url, data)).json();
  }
}

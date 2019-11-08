import {
  AutocompleteResponse,
  AutocompleteSession,
  SessionError,
  Snippet
} from "../ApiModules/autocompleteSession";
import LocalApiServer from "./localApiServer";


export default class AutocompleteDemoSession implements AutocompleteSession {
  private readonly server: LocalApiServer;

  constructor(server: LocalApiServer) {
    this.server = server;
  }

  public async reconnect(): Promise<void> {
    // do nothing
    return Promise.resolve();
  }

  public disconnect(): void {
    // do nothing
  }

  public setOnErrorHandler = (callback: (error: SessionError) => void): void => {
    // do nothing - no errors will occur
  }

  public queryByContent(
    seedText: string,
    currentContext?: string
  ): Promise<AutocompleteResponse | null> {
    const response = this.server.getSnippetsByContent(seedText, currentContext);
    return Promise.resolve(response);
  }

  public queryByName(trigger: string): Promise<AutocompleteResponse | null> {
    const response = this.server.getSnippetsByName(trigger);
    return Promise.resolve(response);
  }

  public async feedback(
    responseId: string,
    snippet: Snippet,
    origin: string
  ): Promise<void> {
    return Promise.resolve();
  }
}

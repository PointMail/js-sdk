import { AutocompleteResponse } from "../ApiModules/autocompleteSession";
import SuggestionsStore from "./suggestionsStore";

export default class LocalApiServer {
  private readonly store: SuggestionsStore;

  constructor() {
    this.store = new SuggestionsStore();
  }

  public httpRequest(
    method: string,
    url: string,
    data?: object,
    headers?: Record<string, string>
  ): Response {
    if (url.startsWith('/extension/custom')) {
      if ('GET' === method) {
        return this.mockResponse(this.extensionCustomGet());
      } else if ('POST' === method) {
        return this.mockResponse(this.extensionCustomPost(data as any));
      }
    }

    return this.mockResponse();
  }

  public extensionCustomGet() {
    const suggestions = this.store.suggestions.
      filter((s) => s.type !== 'default').
      map((s) => {
        return { id: s.suggestion, text: s.suggestion };
      });

    const hotkeys = this.store.hotkeys.
      map((h) => {
        return { id: h.suggestion, text: h.expandedSuggestion, trigger: h.suggestion, type: h.type };
      });

    return {
      hotkeys,
      suggestions
    }
  }

  public extensionCustomPost(data: { type: string, text: string, trigger: string }) {
    if (data.type === "hotkey") {
      this.store.addHotkey(data.trigger, data.text);
      return { status: "success" };
    } else if (data.type === "suggestion") {
      this.store.addCustomSuggestion(data.text);
      return { status: "success" };
    }
    return { status: "failure" };
  }

  public getSuggestions(seedText: string, currentContext?: string): AutocompleteResponse {
    const suggestions = this.store.suggestions.
      filter((meta) => meta.suggestion.startsWith(seedText)).
      slice(0, 3);

    return {
      suggestions,
      seedText,
      responseId: this.randomResponseId(),
    };
  }

  public getHotkeys(triggerSeed: string): AutocompleteResponse {
    const hotkeys = this.store.hotkeys.
      filter((meta) => meta.suggestion.startsWith(triggerSeed)).
      slice(0, 3);

    return {
      suggestions: hotkeys,
      seedText: triggerSeed,
      responseId: this.randomResponseId(),
    };
  }

  public addCustomSuggestion(suggestion: string) {
    this.store.addCustomSuggestion(suggestion);
  }

  public addHotkey(trigger: string, text: string) {
    this.store.addHotkey(trigger, text);
  }

  private mockResponse(body?: any) {
    const init = {
      status: 200,
      statusText: "OK",
      headers: {
        "content-type": "application/json"
      }
    };

    return new Response(JSON.stringify(body), init);
  }

  private randomResponseId(): string {
    return String(Date.now());
  }

}
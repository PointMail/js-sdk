import { AutocompleteResponse } from "../ApiModules/autocompleteSession";
import SuggestionsStore from "./suggestionsStore";

export default class LocalApiServer {
  private store: SuggestionsStore;

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
        return {
          id: s.suggestion,
          text: s.suggestion
        };
      });

    const hotkeys = this.store.hotkeys.
      map((h) => {
        return {
          id: h.suggestion,
          labels: h.labels,
          text: h.expandedSuggestion,
          trigger: h.suggestion,
          type: h.type
        };
      });

    return {
      hotkeys,
      suggestions
    };
  }

  public extensionCustomPost(data: { type: string, text: string, trigger: string, labels: string[] }) {
    if (data.type === "hotkey") {
      return this.addHotkey(data.text, data.trigger, data.labels);
    } else if (data.type === "suggestion") {
      return this.addCustomSuggestion(data.text);
    } else {
      return { success: false, status: "failure" };
    }
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
    if (this.store.customSuggestionExists(suggestion)) {
      return { success: false, status: "Suggestions must be unique" };
    } else {
      this.store.addCustomSuggestion(suggestion);
      return { success: true, status: "success" };
    }
  }

  public addHotkey(text: string, trigger: string, labels: string[]) {
    if (this.store.hotkeyTriggerExists(trigger)) {
      return { success: false, status: "Snippet trigger must be unique" };
    } else {
      this.store.addHotkey(trigger, text, labels);
      return { success: true, status: "success" };
    }
  }

  private mockResponse(body?: any) {
    const init = {
      status: !body.success ? 400 : 200,
      statusText: !body.success ? "BAD REQUEST" : "OK",
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
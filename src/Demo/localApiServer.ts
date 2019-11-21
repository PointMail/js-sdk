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
    if (url.startsWith('/snippets')) {
      if ('GET' === method) {
        return this.mockResponse(this.extensionCustomGet());
      } else if ('POST' === method) {
        return this.mockResponse(this.extensionCustomPost(data as any));
      }
    } else if (url.startsWith('/account')) {
      if ('GET' === method) {
        return this.mockResponse(this.accountGet());
      }
    } else if (url.startsWith('/interactions')) {
      return this.mockResponse({ success: true });
    }

    return this.mockResponse({ success: false });
  }

  public extensionCustomGet() {
    const snippets = this.store.snippets.slice();

    return {
      success: true,
      snippets
    };
  }

  public extensionCustomPost(
    snippet: {
      name: string,
      content: string,
      labels: string[]
    }
  ) {
    if (this.store.snippetNameExists(snippet.name)) {
      return {
        success: false,
        status: "Snippet name must be unique"
      };
    }

    this.store.addSnippet(snippet.name, snippet.content, snippet.labels);
    return {
      success: true,
      status: "success"
    };
  }

  public accountGet() {
    return {
      "success": true,
      "emailAddress": "demo@pointapi.com",
      "name": "Demo Account",
      "preferences": {
        "searchType": "standard",
        "snippetMenuEverywhere": false,
        "tabCompletion": true,
        "websites": []
      },
      "subscription": {
        "dailyLimit": 0,
        "dailyUsage": 0,
        "expirationDate": 4102488000.000,
        "membershipType": "premium",
        "willRenew": true
      }
    };
  }


  public getSnippetsByContent(seedText: string, currentContext?: string): AutocompleteResponse {
    const seedTextLower = seedText.toLowerCase();
    const snippets = this.store.snippets
      .filter((meta) => meta.content.toLowerCase().startsWith(seedTextLower))
      .slice(0, 3);

    return {
      snippets,
      seedText,
      responseId: this.randomResponseId(),
    };
  }

  public getSnippetsByName(seedText: string): AutocompleteResponse {
    const snippets = this.store.snippets.
      filter((meta) => meta.name.toLowerCase().startsWith(seedText.toLowerCase())).
      slice(0, 3);

    return {
      snippets,
      seedText,
      responseId: this.randomResponseId(),
    };
  }

  public addSnippet(name: string, content: string, labels: string[]) {
    this.store.addSnippet(name, content, labels);
  }

  private mockResponse(body: any) {
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
import { Snippet } from "../ApiModules/autocompleteSession";

const INITIAL_SNIPPETS: Snippet[] = [
  { id_:'1', content: 'Nice to meet you!', name: 'intro1', labels: []},
  { id_:'2', content: 'Nice to hear from you.', name: 'intro2', labels: []},
  { id_:'3', content: 'How have you been?', name: 'intro3', labels: []},
  { id_:'4', content: "Point uses AI to predict what you want to say and writes it in your own words. With our suggestions, you will communicate quickly, intelligently, and effortlessly.", name:'about', labels: ['tutorial']}
];

export default class SuggestionsStore {
  public snippets: Snippet[];

  public constructor() {
    this.snippets = INITIAL_SNIPPETS.slice();
  }

  public addSnippet(name: string, snippet: string) {
    this.snippets.push({
      name,
      id_: (this.snippets.length + 1).toString(),
      content: snippet,
      labels: []
    });
  }

  public snippetNameExists(name: string) {
    return this.snippets.filter(snippet => snippet.name === name).length > 0;
  }
}
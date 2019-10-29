import { Snippet } from "../ApiModules/autocompleteSession";

const INITIAL_SNIPPETS: Snippet[] = [
  { id_:'1', content: 'Nice to meet you!', name: 'default1', labels: []},
  { id_:'2', content: 'Nice to hear from you.', name: 'default2', labels: []},
  { id_:'3', content: 'What do you think?', name: 'default3', labels: []}
];

export default class SuggestionsStore {
  public readonly snippets: Snippet[];

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
}
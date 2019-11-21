import { Snippet } from "../ApiModules/autocompleteSession";

const INITIAL_SNIPPETS: Snippet[] = [
  { id_: '1', content: "Hi there, it's great to hear from you!", name: 'hello', labels: [] },
  { id_: '2', content: "Thank you for reaching out. We're currently all set, but I will make sure to ping you should our needs change.", name: 'thanks', labels: [] }
];

export default class SuggestionsStore {
  public snippets: Snippet[];

  public constructor() {
    this.snippets = INITIAL_SNIPPETS.slice();
  }

  public addSnippet(name: string, content: string, labels: string[]) {
    this.snippets.unshift({
      id_: (this.snippets.length + 1).toString(),
      name,
      content,
      labels
    });
  }

  public snippetNameExists(name: string) {
    return this.snippets.filter(snippet => snippet.name === name).length > 0;
  }
}
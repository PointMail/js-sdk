import { SuggestionMeta } from "../ApiModules/autocompleteSession";

const INITIAL_SUGGESTIONS: SuggestionMeta[] = [
  { suggestion: 'Nice to meet you!', type: 'default', baseClass: 'suggestion', expandedSuggestion: '', userAdded: false },
  { suggestion: 'Nice to hear from you.', type: 'default', baseClass: 'suggestion', expandedSuggestion: '', userAdded: false },
  { suggestion: 'What do you think?', type: 'default', baseClass: 'suggestion', expandedSuggestion: '', userAdded: false }
];

const INITIAL_HOTKEYS: SuggestionMeta[] = [
  { suggestion: 'about', type: 'custom', baseClass: 'hotkey', expandedSuggestion: "Point uses AI to predict what you want to say and writes it in your own words. With our suggestions, you will communicate quickly, intelligently, and effortlessly.", userAdded: false },
];

export default class SuggestionsStore {
  public readonly suggestions: SuggestionMeta[];
  public readonly hotkeys: SuggestionMeta[];

  public constructor() {
    this.suggestions = INITIAL_SUGGESTIONS.slice();
    this.hotkeys = INITIAL_HOTKEYS.slice();
  }

  public addCustomSuggestion(suggestion: string) {
    this.suggestions.push({
      suggestion,
      type: 'custom',
      baseClass: 'suggestion',
      expandedSuggestion: '',
      userAdded: true
    });
  }

  public addHotkey(trigger: string, text: string) {
    this.hotkeys.push({
      suggestion: trigger,
      type: 'custom',
      baseClass: 'hotkey',
      expandedSuggestion: text,
      userAdded: true
    });
  }
}
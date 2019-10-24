import { SuggestionMeta } from "../ApiModules/autocompleteSession";

interface SuggestionMetaWithLabels extends SuggestionMeta {
  labels: string[];
}

const INITIAL_SUGGESTIONS: SuggestionMeta[] = [
  { suggestion: 'Nice to meet you!', type: 'default', baseClass: 'suggestion', expandedSuggestion: '', userAdded: false },
  { suggestion: 'Nice to hear from you.', type: 'default', baseClass: 'suggestion', expandedSuggestion: '', userAdded: false },
  { suggestion: 'What do you think?', type: 'default', baseClass: 'suggestion', expandedSuggestion: '', userAdded: false }
];

const INITIAL_HOTKEYS: SuggestionMetaWithLabels[] = [
  { suggestion: 'about', labels: ['tutorial'], type: 'custom', baseClass: 'hotkey', expandedSuggestion: "Point uses AI to predict what you want to say and writes it in your own words. With our suggestions, you will communicate quickly, intelligently, and effortlessly.", userAdded: false },
];

export default class SuggestionsStore {
  public readonly suggestions: SuggestionMeta[];
  public readonly hotkeys: SuggestionMetaWithLabels[];

  public constructor() {
    this.suggestions = INITIAL_SUGGESTIONS.slice();
    this.hotkeys = INITIAL_HOTKEYS.slice();
  }

  public addCustomSuggestion(suggestion: string) {
    this.suggestions.unshift({
      suggestion,
      type: 'custom',
      baseClass: 'suggestion',
      expandedSuggestion: '',
      userAdded: true
    });
  }

  public addHotkey(trigger: string, text: string, labels: string[]) {
    this.hotkeys.unshift({
      suggestion: trigger,
      type: 'custom',
      baseClass: 'hotkey',
      expandedSuggestion: text,
      userAdded: true,
      labels,
    });
  }

  public customSuggestionExists(suggestion: string) {
    return this.suggestions.filter(s => s.suggestion === suggestion).length > 0;
  }

  public hotkeyTriggerExists(trigger: string) {
    return this.hotkeys.filter(h => h.suggestion === trigger).length > 0;
  }
}
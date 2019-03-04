import PointApi, { ErrorResponse } from "./main";
import PointApiBase from "./pointApiBase";

import AccountApiModule, {
  Account,
  Preferences,
  SearchType,
  Subscription
} from "./ApiModules/account";

import AutocompleteSession, {
  ContextType,
  SuggestionMeta,
  ReplyMeta,
  AutocompleteResponse,
  ReplyResponse
} from "./ApiModules/autocompleteSession";

import CustomSuggestionsApiModule, {
  Suggestion,
  Hotkey
} from "./ApiModules/customSuggestions";

import InteractionsApiModule, {
  StatusResponse
} from "./ApiModules/interactions";

export default PointApi;
export { PointApiBase };
export { ErrorResponse };
export { AccountApiModule, Account, Preferences, SearchType, Subscription };
export {
  AutocompleteSession,
  ContextType,
  SuggestionMeta,
  ReplyMeta,
  AutocompleteResponse,
  ReplyResponse
};
export { CustomSuggestionsApiModule, Suggestion, Hotkey };
export { InteractionsApiModule, StatusResponse };
export * from "./main";

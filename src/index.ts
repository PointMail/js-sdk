import PointApi, { ErrorResponse, Account, Subscription } from "./main";
import PointApiBase from "./pointApiBase";

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
export { ErrorResponse, Account, Subscription };
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

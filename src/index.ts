import PointApiImpl, { PointApi, ErrorResponse } from "./main";
import PointApiDemo from "./Demo/pointApiDemo";

import AccountApiModule, {
  Account,
  Preferences,
  SearchType,
  Subscription
} from "./ApiModules/account";

import AutocompleteSessionImpl, {
  AutocompleteSession,
  ContextType,
  SessionError,
  Snippet,
  ReplyMeta,
  AutocompleteResponse,
  ReplyResponse
} from "./ApiModules/autocompleteSession";

import CustomSuggestionsApiModule, {
  GetResponse as CustomSuggestionsGetResponse
} from "./ApiModules/customSuggestions";

import Events from "./ApiModules/events";

import InteractionsApiModule, {
  StatusResponse
} from "./ApiModules/interactions";

export default PointApiImpl;
export { PointApiDemo };
export { PointApi, ErrorResponse };
export { AccountApiModule, Account, Preferences, SearchType, Subscription };
export {
  AutocompleteSession,
  AutocompleteSessionImpl,
  ContextType,
  SessionError,
  Snippet,
  ReplyMeta,
  AutocompleteResponse,
  ReplyResponse
};
export { CustomSuggestionsApiModule, CustomSuggestionsGetResponse };
export { Events };
export { InteractionsApiModule, StatusResponse };
export * from "./main";

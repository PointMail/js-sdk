import PointApiImpl, { PointApi, ErrorResponse } from "./main";
import PointApiDemo from "./Demo/pointApiDemo";

import AccountApiModule, {
  Account,
  Preferences,
  SearchType,
  Subscription,
  WebsitePreferences
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

import SnippetsApiModule, {
  GetResponse as SnippetsGetResponse
} from "./ApiModules/snippets";

import Events from "./ApiModules/events";

import InteractionsApiModule, {
  StatusResponse
} from "./ApiModules/interactions";

export default PointApiImpl;
export { PointApiDemo };
export { PointApi, ErrorResponse };
export {
  AccountApiModule,
  Account,
  Preferences,
  SearchType,
  Subscription,
  WebsitePreferences
};
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
export { SnippetsApiModule, SnippetsGetResponse };
export { Events };
export { InteractionsApiModule, StatusResponse };
export * from "./main";

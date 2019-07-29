import { SuggestionMeta } from "../src/ApiModules/autocompleteSession";

export const suggestions: SuggestionMeta[] = [
  {
    userAdded: false,
    suggestion: "Hello, how are you?",
    expandedSuggestion: "",
    type: "generated",
    baseClass: "suggestion"
  },
  {
    userAdded: false,
    suggestion: "Hello, how was your day?",
    expandedSuggestion: "",
    type: "custom",
    baseClass: "suggestion"
  },
  {
    userAdded: false,
    suggestion: "Hello, my name jeff",
    expandedSuggestion: "",
    type: "generated",
    baseClass: "suggestion"
  }
];

export const replies = [
  {
    prompt: "what is your phone number?",
    suggestions: [
      { confidence: 3, text: "My phone number is PHONE_NUMBER." },
      { confidence: 3, text: "You can reach me at PHONE_NUMBER." },
      { confidence: 3, text: "The best number to reach me at is PHONE_NUMBER." }
    ]
  }
];

export const testResponse = {
  suggestionsResponse: {
    suggestions,
    seedText: null,
    timestamp: null
  },
  repliesResponse: {
    replies,
    responseId: "1234"
  }
};

export const mockSuggestions = jest
  .fn()
  .mockImplementation((data, callback) =>
    callback(testResponse.suggestionsResponse)
  );

export const mockfeedback = jest
  .fn()
  .mockImplementationOnce(callback =>
    callback({ timestamp: "foo", status: "success" })
  )
  .mockImplementationOnce(callback =>
    callback({ timestamp: "foo", status: "failure" })
  )
  .mockImplementationOnce(callback => callback());

export const mockSetRealtimeData = jest
  .fn()
  .mockImplementationOnce(callback =>
    callback({ timestamp: "foo", status: "success" })
  );

export const mockReplies = jest
  .fn()
  .mockImplementationOnce((data, callback) =>
    callback(testResponse.repliesResponse)
  );

const emit = jest.fn().mockImplementation((channel: string, data, callback) => {
  if (channel === "autocomplete") {
    mockSuggestions(data, callback);
  } else if (channel === "feedback" || channel.startsWith("feedback_")) {
    return mockfeedback(callback);
  } else if (channel === "set-realtime-data") {
    mockSetRealtimeData(callback);
  } else if (channel === "reply") {
    mockReplies(data, callback);
  }
});
const connect = jest.fn();
const on = jest.fn();

const mockIo = jest.fn().mockReturnValue({
  on,
  connect,
  emit,
  disconnected: false,
  connected: true,
});

export default mockIo;

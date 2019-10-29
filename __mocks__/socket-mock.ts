import { Snippet } from "../src/ApiModules/autocompleteSession";

export const snippets: Snippet[] = [
  {
    id_: '1',
    content: "Hello, how are you?",
    name: "snip_1",
    labels: []
  },
  {
    id_: '2',
    content: "Hello, how was your day?",
    name: "snip_2",
    labels: []
  },
  {
    id_: '3',
    content: "Hello, my name jeff",
    name: "snip_3",
    labels: []
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
    snippets,
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

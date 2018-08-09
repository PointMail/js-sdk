export const suggestions = [
  { userAdded: false, suggestion: "Hello, how are you?", type: "suggestion" },
  {
    userAdded: false,
    suggestion: "Hello, how was your day?",
    type: "suggestion"
  },
  { userAdded: false, suggestion: "Hello, my name jeff", type: "suggestion" }
];

export const testResponse = {
  suggestionsResponse: {
    suggestions,
    seedText: null,
    timestamp: null
  },
  repliesResponse: {
    replies: suggestions,
    timestamp: null
  }
};

export const mockSuggestions = jest
  .fn()
  .mockImplementation((data, callback) =>
    callback(testResponse.suggestionsResponse)
  );

export const mockChosenSuggestions = jest
  .fn()
  .mockImplementationOnce(callback =>
    callback({ timestamp: "foo", status: "success" })
  )
  .mockImplementationOnce(callback =>
    callback({ timestamp: "foo", status: "failure" })
  )
  .mockImplementationOnce(callback => callback());

export const mockSetContext = jest
  .fn()
  .mockImplementationOnce(callback =>
    callback({ timestamp: "foo", status: "success" })
  );

export const mockReplies = jest
  .fn()
  .mockImplementationOnce((data, callback) =>
    callback(testResponse.repliesResponse)
  );

const emit = jest.fn().mockImplementation((channel, data, callback) => {
  if (channel === "suggestions") {
    mockSuggestions(data, callback);
  } else if (channel === "chosen-suggestions") {
    return mockChosenSuggestions(callback);
  } else if (channel === "set-context") {
    mockSetContext(callback);
  } else if (channel === "replies") {
    mockReplies(data, callback);
  }
});
const mockIo = jest.fn().mockReturnValue({
  emit
});
export default mockIo;

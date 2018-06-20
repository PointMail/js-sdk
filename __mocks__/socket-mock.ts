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
  response: {
    suggestions,
    seedText: null,
    messageId: null
  }
};

export const mockSuggestions = jest
  .fn()
  .mockImplementation((data, callback) => callback(testResponse.response));

export const mockChosenSuggestions = jest
  .fn()
  .mockImplementationOnce(callback => callback("success"))
  .mockImplementationOnce(callback => callback("failure"))
  .mockImplementationOnce(callback => callback());

export const mockSetContext = jest.fn();

const emit = jest.fn().mockImplementation((channel, data, callback) => {
  if (channel === "suggestions") {
    mockSuggestions(data, callback);
  } else if (channel === "chosen-suggestions") {
    return mockChosenSuggestions(callback);
  } else if (channel === "set-context") {
    mockSetContext(data);
  }
});
const mockIo = jest.fn().mockReturnValue({
  emit
});
export default mockIo;

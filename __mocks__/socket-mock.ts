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
export const emit = jest
  .fn()
  .mockImplementation((channel, data, callback) =>
    callback(testResponse.response)
  );
const mockIo = jest.fn().mockReturnValue({
  emit
});
export default mockIo;

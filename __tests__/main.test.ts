import PointApi from "./../src/main";
import {
  suggestions,
  testResponse,
  mockGiveFeedback,
  mockSuggestions,
  mockSetContext,
  mockReplies,
  replies
} from "../__mocks__/socket-mock";
const { suggestionsResponse } = testResponse;
const emailAddress = "aiansiti@college.harvard.edu";
const authCode = "authcode1234";
jest.mock(
  "socket.io-client",
  () => require.requireActual("../__mocks__/socket-mock").default
);
process.env.REACT_APP_BASE_URI = "localhost:5000";
const api = new PointApi(emailAddress, authCode);

test("Inits PointApi object correctly", () => {
  expect(api.emailAddress).toEqual(emailAddress);
  expect(api.authCode).toEqual(authCode);
});
describe("Query suggestions", () => {
  test("Returns results correctly", async () => {
    const seedText = "hello123";
    const result = await api.searchSuggestions(seedText);
    expect(result.suggestions).toHaveLength(3);
    expect(mockSuggestions.mock.calls[0][0]).toHaveProperty(
      "seedText",
      seedText
    );
  });
  test("Bad responses", async () => {
    suggestionsResponse.suggestions = [];
    expect(await api.searchSuggestions("hello")).toBeNull();
    suggestionsResponse.suggestions = null;
    expect(await api.searchSuggestions("hello")).toBeNull();
    delete testResponse.suggestionsResponse;
    expect(await api.searchSuggestions("hello")).toBeNull();
  });
});

test("Chosen suggestions tracking", async () => {
  await expect(
    api.giveFeedback("", suggestions[0], "positive")
  ).resolves.toBeUndefined();
  expect(mockGiveFeedback).toBeCalled();
  await expect(
    api.giveFeedback("", suggestions[0], "positive")
  ).rejects.toThrow();
  await expect(
    api.giveFeedback("", suggestions[0], "positive")
  ).rejects.toThrow();
});

test("Set Gmail Context", async () => {
  const context = { pastContext: "hello", contextType: "gmail" };
  await expect(
    api.setContext(context.pastContext, context.contextType)
  ).resolves.toEqual("success");
  expect(mockSetContext).toBeCalled();
});

test("Gets replies", async () => {
  const context = { pastContext: "hello", contextType: "text" };
  const result = await api.getReplies(context.pastContext, context.contextType);
  expect(result.replies[0].replies).toHaveLength(3);
  expect(mockReplies).toBeCalled();
});

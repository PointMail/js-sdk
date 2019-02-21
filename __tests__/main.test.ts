import PointApi from "./../src/main";
import {
  suggestions,
  testResponse,
  mockfeedback,
  mockSuggestions,
  mockSetContext,
  mockReplies,
  replies
} from "../__mocks__/socket-mock";
const { suggestionsResponse } = testResponse;
const emailAddress = "aiansiti@college.harvard.edu";
const authCode = () => {
  return "authcode1234";
};
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
    const result = await api.autocomplete(seedText);
    expect(result.suggestions).toHaveLength(3);
    expect(mockSuggestions.mock.calls[0][0]).toHaveProperty(
      "seedText",
      seedText
    );
  });
  test("Bad responses", async () => {
    suggestionsResponse.suggestions = [];
    expect(await api.autocomplete("hello")).toBeNull();
    suggestionsResponse.suggestions = null;
    expect(await api.autocomplete("hello")).toBeNull();
    delete testResponse.suggestionsResponse;
    expect(await api.autocomplete("hello")).toBeNull();
  });
});

test("Chosen suggestions tracking", async () => {
  await expect(
    api.feedback("", suggestions[0].suggestion, "positive")
  ).resolves.toBeUndefined();
  expect(mockfeedback).toBeCalled();
  await expect(
    api.feedback("", suggestions[0].suggestion, "positive")
  ).rejects.toThrow();
  await expect(
    api.feedback("", suggestions[0].suggestion, "positive")
  ).rejects.toThrow();
});

test("Set Gmail Context", async () => {
  await api.setContext("hello", "gmail");
  expect(mockSetContext).toBeCalled();
});

test("Gets replies", async () => {
  const result = await api.reply("hello", "text");
  expect(result.replies[0].suggestions).toHaveLength(3);
  expect(mockReplies).toBeCalled();
});

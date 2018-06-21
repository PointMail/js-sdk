import PointApi from "./../src/main";
import {
  suggestions,
  testResponse,
  mockChosenSuggestions,
  mockSuggestions,
  mockSetContext
} from "../__mocks__/socket-mock";
const { response } = testResponse;
const emailAddress = "aiansiti@college.harvard.edu";
const authCode = "authcode1234";
jest.mock(
  "socket.io-client",
  () => require.requireActual("../__mocks__/socket-mock").default
);
const api = new PointApi(emailAddress, authCode);

test("Inits PointApi object correctly", () => {
  expect(api.emailAddress).toEqual(emailAddress);
  expect(api.authCode).toEqual(authCode);
});
describe("Query suggestions", () => {
  test("Returns results correctly", async () => {
    const seedText = "hello123";
    const result = await api.searchSuggestions(seedText);
    expect(result).toHaveLength(3);
    expect(mockSuggestions.mock.calls[0][0]).toHaveProperty(
      "seedText",
      seedText
    );
  });
  test("Bad queries", async () => {
    expect(await api.searchSuggestions("")).toBeNull();
    expect(await api.searchSuggestions("      ")).toBeNull();
  });
  test("Bad responses", async () => {
    response.suggestions = [];
    expect(await api.searchSuggestions("hello")).toBeNull();
    response.suggestions = null;
    expect(await api.searchSuggestions("hello")).toBeNull();
    delete testResponse.response;
    expect(await api.searchSuggestions("hello")).toBeNull();
  });
});

test("Chosen suggestions tracking", async () => {
  await expect(
    api.reportChosenSuggestion("hello", suggestions, suggestions[2], "")
  ).resolves.toBeUndefined();
  expect(mockChosenSuggestions).toBeCalled();
  await expect(
    api.reportChosenSuggestion("hello", suggestions, suggestions[2], "")
  ).rejects.toThrow();
  await expect(
    api.reportChosenSuggestion("hello", suggestions, suggestions[2], "")
  ).rejects.toThrow();
});

test("Set Context", async () => {
  const context = { pastContext: "hello", contextType: "gmail" };
  await api.setContext(context.pastContext, context.contextType);
  expect(mockSetContext).toBeCalledWith(context);
});

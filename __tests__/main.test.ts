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
    expect(result).toHaveLength(3);
    expect(mockSuggestions.mock.calls[0][0]).toHaveProperty(
      "seedText",
      seedText
    );
  });
  test("Returns Smart Reply suggestions", async () => {
    expect(await api.searchSuggestions("")).toHaveLength(3);
    expect(await api.searchSuggestions("      ")).toHaveLength(3);
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

test("Set Gmail Context", async () => {
  const context = { pastContext: "hello", contextType: "gmail" };
  await expect(
    api.setContext(context.pastContext, context.contextType)
  ).resolves.toEqual("success");
  expect(mockSetContext).toBeCalled();
});
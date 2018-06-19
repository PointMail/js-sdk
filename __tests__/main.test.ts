import PointApi from "./../src/main";
import {
  suggestions,
  testResponse,
  mockChosenSuggestions,
  mockSuggestions
} from "../__mocks__/socket-mock";
const { response } = testResponse;
const emailAddress = "aiansiti@college.harvard.edu";
const apiKey = "apikey1234";
jest.mock(
  "socket.io-client",
  () => require.requireActual("../__mocks__/socket-mock").default
);
const api = new PointApi(emailAddress, apiKey);

test("Inits PointApi object correctly", () => {
  expect(api.emailAddress).toEqual(emailAddress);
  expect(api.apiKey).toEqual(apiKey);
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
  expect(
    api.reportChosenSuggestion(null, suggestions, suggestions[2], "")
  ).rejects.toThrow();
  expect(
    api.reportChosenSuggestion("hello", suggestions, suggestions[2], "")
  ).resolves.toBeUndefined();
  expect(
    api.reportChosenSuggestion("hello", suggestions, suggestions[2], "")
  ).rejects.toThrow();
  expect(
    api.reportChosenSuggestion("hello", suggestions, suggestions[2], "")
  ).rejects.toThrow();
});

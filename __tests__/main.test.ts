import PointApi from "./../src/main";
import { emit, testResponse } from "../__mocks__/socket-mock";
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
    expect(emit.mock.calls[0][1]).toHaveProperty("seedText", seedText);
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

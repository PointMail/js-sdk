import { PointApi } from "./../src/main";

const emailAddress = "aiansiti@college.harvard.edu";
const apiKey =
  "93d7911f2011781e5965763d5ce940ab8886e22a9fae8c34a1592e1f9ece758a0404f8016868a7855397703805945191";

describe("General Suggestion List", () => {
  const api = new PointApi(emailAddress, apiKey);

  test("Inits PointApi object correctly", () => {
    expect(api.emailAddress).toEqual(emailAddress);
    expect(api.apiKey).toEqual(apiKey);
  });
  // test("Retrieves Suggestion List", async () => {
  //   expect(api.suggestions).toBeTruthy();
  //   expect(api.suggestions.length).toBeGreaterThan(0);
  //   expect(api.suggestions[0].suggestion).toBeTruthy();
  // });

  // test("Searches Suggestion List", async () => {
  //   const found = await api.searchSuggestions("hello");
  //   expect(found.length).toBeGreaterThan(0);
  //   expect(found[0].suggestion).toBeTruthy();
  //   const notFound = await api.searchSuggestions("0x@#$%^&*(");
  //   expect(notFound.length).toBeFalsy();
  // });
});

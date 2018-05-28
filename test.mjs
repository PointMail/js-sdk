import PointApi from "./index";

async function main() {
  const api = new PointApi(
    "aiansiti@college.harvard.edu",
    "93d7911f2011781e5965763d5ce940ab8886e22a9fae8c34a1592e1f9ece758a0404f8016868a7855397703805945191"
  );
  await api.loadSuggestions();
  try {
    console.log((await api.searchSuggestions("hello"))[0]);
  } catch (e) {
    console.log(e);
  }
}
main();

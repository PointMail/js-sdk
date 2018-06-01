//@flow
import axios from "axios";
import fuzzysearch from "./search";

const ROOT_URI = "https://alpha-autocomplete.easyemail.ai";

type SuggestionMeta = { suggestion: string, userAdded: boolean, type: string };

class PointApi {
  emailAddress: string;
  authCode: string;
  suggestions: Array<SuggestionMeta>;

  constructor(emailAddress: string, authCode: string) {
    this.emailAddress = emailAddress;
    this.authCode = authCode;
    this.suggestions = [];
  }

  async getSuggestions() {
    try {
      const result = await axios.get(ROOT_URI + "/suggestions", {
        params: { emailAddress: this.emailAddress, authCode: this.authCode }
      });
      this.suggestions = result.data.suggestions.slice();
      return this.suggestions;
    } catch (e) {
      throw new Error("Unable to get suggestions");
    }
  }

  async searchSuggestions(query: string): Promise<Array<SuggestionMeta>> {
    if (!this.suggestions.length) {
      throw new Error("Suggestions not loaded");
    }
    if (!query || !query.trim()) {
      return [];
    }
    const punctuationReg = /[,\/;:\-_()']/g;
    query = query
      .toLowerCase()
      .trim()
      .replace(punctuationReg, "");
    return this.suggestions.filter(meta => {
      const sentence = meta.suggestion
        .toLowerCase()
        .replace(punctuationReg, "");
      if (sentence === query) return false;
      return fuzzysearch(query, sentence); //fuzzy search on the entire database of answers. Search isn't case-specific.
    });
  }
}

export default PointApi;

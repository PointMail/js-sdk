import axios from "axios";
import fuzzysearch from "./search";
const ROOT_URI = "https://alpha-autocomplete.easyemail.ai";

class PointApi {
  constructor(emailAddress, authCode) {
    this.emailAddress = emailAddress;
    this.authCode = authCode;
    this.suggestions = null;
  }

  async loadSuggestions() {
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

  async searchSuggestions(query) {
    if (!this.suggestions) {
      throw new Error("Suggestions not loaded");
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
      return fuzzysearch(query, sentence); //fuzzy search on the entire database of answers. Search isn't case-specific.
    });
  }
}

export default PointApi;

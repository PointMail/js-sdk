(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('axios')) :
  typeof define === 'function' && define.amd ? define(['axios'], factory) :
  (global['point-api'] = factory(global.axios));
}(this, (function (axios) { 'use strict';

  axios = axios && axios.hasOwnProperty('default') ? axios['default'] : axios;

  //     

  function fuzzysearch(needle        , haystack        )          {
    // Fuzzy search as done by Matt.
    const split_in = needle.split(/(\s+)/, 1);
    if (split_in.length > 1) {
      if (!haystack.split(/(\s+)/, 5).includes(split_in[0])) {
        return false;
      }
    } else {
      if (!haystack.startsWith(needle)) {
        return false;
      }
    }
    var hlen = haystack.length;
    var nlen = needle.length;
    if (nlen > hlen) {
      return false;
    }
    if (nlen === hlen) {
      return needle === haystack;
    }
    outer: for (var i = 0, j = 0; i < nlen; i++) {
      var nch = needle.charCodeAt(i);
      while (j < hlen) {
        if (haystack.charCodeAt(j++) === nch) {
          continue outer;
        }
      }
      return false;
    }
    return true;
  }

  //     

  const ROOT_URI = "https://alpha-autocomplete.easyemail.ai";

                                                                                 

  class PointApi {
                         
                     
                                       

    constructor(emailAddress        , authCode        ) {
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

    async searchSuggestions(query        )                                 {
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

  return PointApi;

})));

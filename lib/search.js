//     

export default function fuzzysearch(needle        , haystack        )          {
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

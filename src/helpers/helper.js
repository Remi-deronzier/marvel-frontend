const escapeRegexCharacters = (str) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const AutosuggestHighlightMatch = (text, query) => {
  const escapedValue = escapeRegexCharacters(query.trim());
  const regex = new RegExp(escapedValue, "i");
  const res = regex.exec(text);
  return [[res.index, res.index + query.length]];
};

export { AutosuggestHighlightMatch, escapeRegexCharacters };

export const splitByQuery = (query, text) => {
  const trimmedQuery = query.trim();
  const queryLength = trimmedQuery.length;
  const startIndex = text.toLowerCase().indexOf(trimmedQuery.toLowerCase());

  /*
   * If for whatever reason there is no match -> return initial text
   */
  if (startIndex === -1) {
    return [{ text }];
  }

  /*
   * First part  -> not matched
   * Second part -> to be highlighted
   * Third part  -> not matched
   *
   * ! Don't forget to remove empty pieces
   */
  return [
    { text: text.slice(0, startIndex) },
    {
      text: text.slice(startIndex, startIndex + queryLength),
      isHighlighted: true,
    },
    { text: text.slice(startIndex + queryLength) },
  ].filter((item) => item.text);
};


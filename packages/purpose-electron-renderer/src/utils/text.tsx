export function getFirstLine(text) {
  text = text.split('\n')[0].trim();
  if (text[text.length - 1] === ':') {
    return text.slice(0, text.length - 1);
  }
  return text;
}

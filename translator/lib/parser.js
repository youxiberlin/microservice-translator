export default function parser (data) {
  const getMainText = (line) => {
    const words = line.split(' ')
    return words.slice(4, words.length).join(' ')
  };

  const lines = data.toString().split('\n');
  const content = lines.slice(1, arr.length);
  const mainTexts = content.map(line => getMainText(line));
  // TODO split when there is '-' or ','
  return mainTexts;
}
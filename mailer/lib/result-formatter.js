const resultFormatter = (result, original) => {
  const preContents = original
    .split('\n')
    .map(curr => curr.split(' ').slice(0, 4).join(' '))
  const output = result
    .split('\n')
    .filter(Boolean)
    .map((curr, i) => `${preContents[i]} ${curr}`)
    .join('\n')
  return output;
}

/**
 * 
 * @param {string} result
 * @param {string} original
 */
const makeFinalOutput = (result, original) => {
  return `Translation Result\n${resultFormatter(result, original)}\n\nOriginal Text\n${original}`;
}

module.exports = {
  makeFinalOutput
}

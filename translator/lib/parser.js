const splitLine = data => data.split('\n');

const extract = line => {
  const words = line.split(' ')
  return words.slice(4, words.length).join(' ')
}

/**
 * 
 * @param {string} data request data for translation
 */
const parseData = data => {
  return splitLine(data).map(item => extract(item))
}

module.exports = {
  parseData
}
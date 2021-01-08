const data = require('../data/data');

const calcLevenDistance = (a, b) => {
  if(a.length == 0) return b.length; 
  if(b.length == 0) return a.length; 
  var matrix = [];
  var i;
  for(i = 0; i <= b.length; i++){
    matrix[i] = [i];
  }
  var j;
  for(j = 0; j <= a.length; j++){
    matrix[0][j] = j;
  }

  for(i = 1; i <= b.length; i++){
    for(j = 1; j <= a.length; j++){
      if(b.charAt(i-1) == a.charAt(j-1)){
        matrix[i][j] = matrix[i-1][j-1];
      } else {
        matrix[i][j] = Math.min(matrix[i-1][j-1] + 1,
        Math.min(matrix[i][j-1] + 1,
        matrix[i-1][j] + 1));
      }
    }
  }
  return matrix[b.length][a.length];
}

/**
 * @param {string} words - words to translate
 * @param {Array} data 
 */
const translateSentence = (data, sentence) => {
  const scoreArr = [];
  let result;
  for (let i = 0; i < data.length; i++) {
    const distance = calcLevenDistance(sentence, data[i].source);
    scoreArr.push(distance)
    if (distance === 0) {
      result = data[i].target;
      break;
    }
  }
  const min = Math.min(...scoreArr);
  const canTranslate = min < 5 ? true : false;
  const idx = scoreArr.indexOf(min)
  result = data[idx].target;
  return canTranslate ? result : sentence;
};

/**
 * 
 * @param {Array} source - array of sentences
 */
const translator = (data, source) => source.map(sentence => translateSentence(data, sentence));

// const source1 = {
//   sourceLng: 'en',
//   targetLng: 'de',
//   source: [
//     "Hello World",
//     "Hello guys",
//     "I walk to the supermarket",
//   ]
// }

// console.log(translator(data, source1.source))
// result [ 'Hallo Welt', 'Hallo Leute', 'Ich gehe zum Supermarkt.' ]
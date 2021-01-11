const { translator, calcLevenDistance, translateSentence } = require('../lib/translator');
const dictData = require('./data/dictionary.json')

test('calcLevenDistance calcs correct distance', () => {
  expect(calcLevenDistance('yuki', 'yuki')).toBe(0);
  expect(calcLevenDistance('yuki', 'yuk')).toBe(1);
  expect(calcLevenDistance('yuki', 'oukii')).toBe(2);
  expect(calcLevenDistance('Yuki', 'yuki')).toBe(1);
});

test('translateSentence returns correct results', () => {
  expect(translateSentence(dictData, "Hello World")).toMatch("Hallo Welt");
  expect(translateSentence(dictData, "Hello guys")).toMatch("Hallo Leute");
  expect(translateSentence(dictData, "I walk to the supermarket")).toMatch("Ich gehe zum Supermarkt.");
})

test('translator returns correct results', () => {
  expect(translator(dictData, ["Hello World"])).toEqual(["Hallo Welt"]);
})
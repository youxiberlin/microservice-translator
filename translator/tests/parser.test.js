const reqData = require('./data/reqData');
const { parseData } = require('../lib/parser');

test('parseData parses request data correctly', () => {
  expect(parseData(reqData)).toEqual(['Hello World', 'Hello guys.', 'I walk to the supermarket.'])
});

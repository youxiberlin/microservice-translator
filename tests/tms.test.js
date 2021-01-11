const request = require('supertest');
const { server: tms } = require('../tms/app');
const newData = require('./data/dictionary.json');

describe('POST /data - upload a new dictionary data', () => {
  afterEach(function () {
    tms.close();
  });

  it('should import a new dictionary data', (done) => {
    return request(tms)
    .post('/data')
    .send(newData)
    .expect(200, {
      status: "Success!",
      message: "Data is successfully imported."
    }, done)
  })

  it('should reject a data that has not all the keys', (done) => {
    return request(tms)
    .post('/data')
    .send({
      "source": "I walk to the supermarket",
      "sourceLanguage": "en",
      "targetLanguage": "de"
    })
    .expect(400, {
      status: "error",
      statusCode: 400,
      message: "Please input a valid dictionary data"
    }, done)
  })
})


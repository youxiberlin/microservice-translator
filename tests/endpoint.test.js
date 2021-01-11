const request = require('supertest');
const { app } = require('../gateway/app');

describe('POST /api/v1/endpoint - upload a new file', () => {
  const filePath = `${__dirname}/data/source.txt`;

  it('should do something', () => {
    return request(app)
    .post('/data/upload')
    .field({email: 'yuki@yuki.com'})
    .attach('subtitle-text', filePath)
    .expect(200)
    .then((res) => {
      const { message } = res.body;
      console.log('message', message)
      expect(message).toBe('Successfully uploaded source.txt');
      done();
    })
    .catch(err => console.log(err));
  })
})

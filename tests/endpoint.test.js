const request = require('supertest');
const { server } = require('../gateway/app');

describe('POST /api/v1/endpoint - upload a new file', () => {
  afterEach(function () {
    server.close();
  });
  const filePath = `${__dirname}/data/source.txt`;
  it('should do something', (done) => {
    return request(server)
    .post('/data/upload')
    .field({email: 'yuki@yuki.com'})
    .attach('subtitle-text', filePath)
    .expect(200, {
      message: 'Successfully uploaded source.txt',
      id: 1,
    }, done)
  })
})

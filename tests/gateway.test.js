const request = require('supertest');
const { server: gateway } = require('../gateway/app');

describe('POST /data/upload - upload a new file and email', () => {
  afterEach(function () {
    gateway.close();
  });

  const filePath = `${__dirname}/data/source.txt`;
  it('should upload file and send email', (done) => {
    return request(gateway)
    .post('/data/upload')
    .field({email: 'yuki@yuki.com'})
    .attach('subtitle-text', filePath)
    .expect(200, {
      message: 'Successfully uploaded source.txt',
      id: 1,
    }, done)
  })

  it('should reject wrong email', (done) => {
    return request(gateway)
    .post('/data/upload')
    .field({email: 'yukiyuki.com'})
    .attach('subtitle-text', filePath)
    .expect(400, {
      status: "error",
      statusCode: 400,
      message: "Please input a valid email"
    }, done)
  })

  it('should reject if there is no file attached', (done) => {
    return request(gateway)
    .post('/data/upload')
    .field({email: 'yukiyuki.com'})
    .expect(400, {
      status: "error",
      statusCode: 400,
      message: "Please upload a file"
    }, done)
  })
})


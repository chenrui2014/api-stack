'use strict'

const Koa = require('koa')
const co = require('co')
const expect = require('expect.js')
const request = require('supertest-as-promised')
const middleware = require('./../../src/middleware')

describe('middleware.forceSSL', function () {

  it('should redirect http to https', co.wrap(function *() {
    const app = new Koa()
    app.use(middleware.forceSSL())
    const res = yield request(app.listen()).get('/').expect(301)
    expect(res.headers.location.indexOf('https')).to.equal(0)
  }))

  it('should pass options to koa-sslify', co.wrap(function *() {
    const app = new Koa()
    app.use(middleware.forceSSL({ trustProtoHeader: true }))
    const res = yield request(app.listen())
    .get('/')
    .set('x-forwarded-proto', 'https')
    .expect(404)
  }))

})

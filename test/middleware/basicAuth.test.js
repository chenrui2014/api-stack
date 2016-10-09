'use strict'

const Koa = require('koa')
const co = require('co')
const expect = require('expect.js')
const sinon = require('sinon')
const request = require('supertest-as-promised')
const _ = require('lodash')
const middleware = require('./../../src/middleware')
const errors = require('./../../src/apiErrors')

describe('middleware.basicAuth', function () {

  it('should return 401 with www-authenticate', co.wrap(function *() {
    const app = new Koa()
    app.use(middleware.basicAuth(function (ctx, credentials) {

    }))
    const res = yield request(app.listen())
    .get('/')
    .expect(401)
    expect(res.headers['www-authenticate']).to.equal('Basic realm="realm"')
  }))

  it('should not exec callback if Basic credentials missing', co.wrap(function *() {
    const app = new Koa()
    const spy = sinon.spy()
    app.use(middleware.basicAuth(spy))
    const res = yield request(app.listen())
    .get('/')
    .expect(401)
    expect(spy.called).to.equal(false)
  }))

  it('should exec callback with ctx and credentials', co.wrap(function *() {
    const app = new Koa()
    const spy = sinon.spy()
    app.use(middleware.basicAuth(spy))
    const res = yield request(app.listen())
    .get('/abc')
    .set('Authorization', `Basic ${new Buffer('a:b').toString('base64')}`)
    .expect(401)
    expect(spy.calledOnce).to.equal(true)
    expect(spy.getCall(0).args[0].path).to.equal('/abc')
    expect(spy.getCall(0).args[1]).to.eql({ login: 'a', password: 'b' })
  }))

  it('should pass if callback function returns true', co.wrap(function *() {
    const app = new Koa()
    const spy = sinon.spy()
    app.use(middleware.basicAuth(function (ctx, credentials) {
      spy()
      return credentials.login === 'a' && credentials.password === 'b'
    }))
    const res = yield request(app.listen())
    .get('/')
    .set('Authorization', `Basic ${new Buffer('a:b').toString('base64')}`)
    .expect(404)
    expect(spy.calledOnce).to.equal(true)
  }))

  it('should handle Promise returned from callback function', co.wrap(function *() {
    const app = new Koa()
    const spy = sinon.spy()
    app.use(middleware.basicAuth(function (ctx, credentials) {
      spy()
      return Promise.resolve(false)
    }))
    const res = yield request(app.listen())
    .get('/')
    .set('Authorization', `Basic ${new Buffer('a:b').toString('base64')}`)
    .expect(401)
    expect(spy.calledOnce).to.equal(true)
  }))

  it('should accept realm option', co.wrap(function *() {
    const app = new Koa()
    app.use(middleware.basicAuth(function (ctx, credentials) {

    }, { realm: 'abc' }))
    const res = yield request(app.listen())
    .get('/')
    .expect(401)
    expect(res.headers['www-authenticate']).to.equal('Basic realm="abc"')
  }))

})

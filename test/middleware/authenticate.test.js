'use strict'

const Koa = require('koa')
const co = require('co')
const expect = require('expect.js')
const sinon = require('sinon')
const request = require('supertest-as-promised')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const middleware = require('./../../src/middleware')
const errors = require('./../../src/apiErrors')

describe('middleware.authenticate', function () {

  it('should parse x-access-token by default', co.wrap(function *() {
    const spy = sinon.spy()
    const app = new Koa()
    app.use(middleware.authenticate('abc'))
    app.use(function (ctx, next) {
      spy(ctx.user)
      return next()
    })
    const token = jwt.sign({ ok: true }, 'abc')
    const res = yield request(app.listen())
    .get('/')
    .set('x-access-token', token)
    expect(spy.calledOnce).to.equal(true)
    expect(_.omit(spy.getCall(0).args[0], 'iat')).to.eql({ ok: true })
  }))

  it('should respect tokenPath option', co.wrap(function *() {
    const spy = sinon.spy()
    const app = new Koa()
    app.use(middleware.authenticate('abc', { tokenPath: 'query.accessToken' }))
    app.use(function (ctx, next) {
      spy(ctx.user)
      return next()
    })
    const token = jwt.sign({ ok: true }, 'abc')
    const res = yield request(app.listen())
    .get('/?accessToken=' + token)
    expect(spy.calledOnce).to.equal(true)
    expect(_.omit(spy.getCall(0).args[0], 'iat')).to.eql({ ok: true })
  }))

  it('should respect payloadPath', co.wrap(function *() {
    const spy = sinon.spy()
    const app = new Koa()
    app.use(middleware.authenticate('abc', { payloadPath: 'state.token' }))
    app.use(function (ctx, next) {
      spy(ctx.state.token)
      return next()
    })
    const token = jwt.sign({ ok: true }, 'abc')
    const res = yield request(app.listen())
    .get('/')
    .set('x-access-token', token)
    expect(spy.calledOnce).to.equal(true)
    expect(_.omit(spy.getCall(0).args[0], 'iat')).to.eql({ ok: true })
  }))

  it('should throw errors.UnauthorizedError on invalid token', co.wrap(function *() {
    const spy = sinon.spy()
    const app = new Koa()
    app.silent = true
    app.use(co.wrap(function *(ctx, next) {
      try {
        yield next()
      } catch (err) {
        spy(err)
        throw err
      }
    }))
    app.use(middleware.authenticate('abc'))
    const token = jwt.sign({ ok: true }, 'invalid_secret')
    const res = yield request(app.listen())
    .get('/')
    .set('x-access-token', token)
    .expect(500)
    expect(spy.calledOnce).to.equal(true)
    expect(spy.getCall(0).args[0]).to.be.a(errors.UnauthorizedError)
  }))

  it('should set payload to null if token is missing', co.wrap(function *() {
    const spy = sinon.spy()
    const app = new Koa()
    app.use(middleware.authenticate('abc'))
    app.use(function (ctx, next) {
      spy(ctx.user)
      return next()
    })
    const token = jwt.sign({ ok: true }, 'abc')
    const res = yield request(app.listen())
    .get('/')
    expect(spy.calledOnce).to.equal(true)
    expect(spy.getCall(0).args[0]).to.equal(null)
  }))

  it('should pass jwtVerifyOptions to jwt.verify method', co.wrap(function *() {
    const spy = sinon.spy()
    const orig = jwt.verify
    const stub = sinon.stub(jwt, 'verify', function (jwt, secret, options) {
      spy(options)
      return orig.apply(jwt, arguments)
    })
    const app = new Koa()
    app.use(middleware.authenticate('abc', { jwtVerifyOptions: { opt: true } }))
    const token = jwt.sign({ ok: true }, 'abc')
    const res = yield request(app.listen())
    .get('/')
    .set('x-access-token', token)
    .expect(404)
    expect(spy.getCall(0).args[0]).to.eql({ opt: true })
    jwt.verify.restore()
  }))

})

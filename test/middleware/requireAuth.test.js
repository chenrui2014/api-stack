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

describe('middleware.requireAuth', function () {

  it('should do nothing if payload is present at ctx.user', co.wrap(function *() {
    const app = new Koa()
    app.use(function (ctx, next) {
      ctx.user = {}
      return next()
    })
    app.use(middleware.requireAuth())
    const res = yield request(app.listen())
    .get('/')
    .expect(404)
  }))

  it('should throw errors.UnauthorizedError if payload is missing', co.wrap(function *() {
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
    app.use(middleware.requireAuth())
    const res = yield request(app.listen())
    .get('/')
    .expect(500)
    expect(spy.getCall(0).args[0]).to.be.a(errors.UnauthorizedError)
  }))

  it('should respect payloadPath option', co.wrap(function *() {
    const app = new Koa()
    app.use(function (ctx, next) {
      ctx.state.user = {}
      return next()
    })
    app.use(middleware.requireAuth({ payloadPath: 'state.user' }))
    const res = yield request(app.listen())
    .get('/')
    .expect(404)
  }))

})

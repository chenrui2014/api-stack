'use strict'

const Koa = require('koa')
const co = require('co')
const expect = require('expect.js')
const sinon = require('sinon')
const request = require('supertest-as-promised')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const bodyParser = require('koa-bodyparser')
const Boom = require('boom')
const middleware = require('./../../src/middleware')
const errors = require('./../../src/apiErrors')

describe('middleware.errorHandler', function () {

  it('should do nothing if there is no error', co.wrap(function *() {
    const app = new Koa()
    app.use(middleware.errorHandler())
    app.use(function (ctx, next) {
      ctx.body = {}
      return next()
    })
    const res = yield request(app.listen())
    .get('/')
    .expect(200)
  }))

  it('should return proper response on 404 error', co.wrap(function *() {
    const app = new Koa()
    app.use(middleware.errorHandler())
    const res = yield request(app.listen())
    .get('/')
    .expect(404)
    expect(_.omit(res.body, 'message')).to.eql({ statusCode: 404, code: 'notFound' })
  }))

  /*it('should return 400 on SyntaxError', co.wrap(function *() {
    sinon.stub(require('superagent').serialize, 'application/json').returns('{invalid}')
    const app = new Koa()
    app.silent = true
    app.use(middleware.errorHandler())
    app.use(bodyParser())
    const res = yield request(app.listen())
    .post('/')
    .send({})
    .expect(400)
    expect(_.omit(res.body, 'message')).to.eql({
      statusCode: 400,
      code: 'badRequest',
      errors: [
        {
          code: 'invalidJSON',
          message: 'Invalid JSON in request body'
        }
      ],
    })
  }))*/

  it('should handle server error', co.wrap(function *() {
    const app = new Koa()
    app.silent = true
    app.use(middleware.errorHandler())
    app.use(function (ctx, next) {
      throw new Error('abc')
    })
    const res = yield request(app.listen())
    .get('/')
    .expect(500)
    expect(res.body).to.eql({
      statusCode: 500,
      message: 'Internal Server Error',
      code: 'internalServerError',
    })
  }))

  it('should not change boom error', co.wrap(function *() {
    const app = new Koa()
    app.silent = true
    app.use(middleware.errorHandler())
    app.use(function (ctx, next) {
      throw new Boom.badRequest()
    })
    const res = yield request(app.listen())
    .get('/')
    .expect(400)
    expect(_.omit(res.body, ['message'])).to.eql({
      statusCode: 400,
      code: 'badRequest',
    })
  }))

  it('should not change app error', co.wrap(function *() {
    const app = new Koa()
    app.silent = true
    app.use(middleware.errorHandler())
    app.use(function (ctx, next) {
      throw new errors.ValidationError('path', 'keyword', 'message')
    })
    const res = yield request(app.listen())
    .get('/')
    .expect(400)
    expect(_.omit(res.body, ['message'])).to.eql({
      statusCode: 400,
      code: 'badRequest',
      errors: [{ path: 'path', keyword: 'keyword', message: 'message' }],
    })
  }))

  it('should not emit error on status < 400', co.wrap(function *() {
    const spy = sinon.spy()
    const app = new Koa()
    app.on('error', spy)
    app.silent = true
    app.use(middleware.errorHandler())
    app.use(function (ctx, next) {
      const err = new Error('custom error')
      Boom.wrap(err, 400)
      err.output.statusCode = 302
      throw err
    })
    const res = yield request(app.listen())
    .get('/')
    .expect(302)
    expect(spy.called).to.equal(false)
  }))

  it('should emit on status >= 400', co.wrap(function *() {
    const spy = sinon.spy()
    const app = new Koa()
    app.on('error', spy)
    app.silent = true
    app.use(middleware.errorHandler())
    app.use(function (ctx, next) {
      const err = new Error('custom error')
      Boom.wrap(err, 400)
      throw err
    })
    const res = yield request(app.listen())
    .get('/')
    .expect(400)
    expect(spy.calledOnce).to.equal(true)
  }))

})

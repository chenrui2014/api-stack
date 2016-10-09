'use strict'

const Koa = require('koa')
const co = require('co')
const expect = require('expect.js')
const sinon = require('sinon')
const request = require('supertest-as-promised')
const _ = require('lodash')
const bodyParser = require('koa-bodyparser')
const middleware = require('./../../src/middleware')
const errors = require('./../../src/apiErrors')

describe('middleware.swaggerRouter', function () {

  it('should throw error if swagger is not valid', co.wrap(function *() {
    expect(middleware.swaggerRouter).to.throwError() // TODO customize error? validate in tests?
  }))

  it('should not throw error if swagger is valid', co.wrap(function *() {
    const swagger = {
      swagger: '2.0',
      info: {
        title: 'api',
        version: '0.0.1',
      },
      paths: {},
    }
    expect(middleware.swaggerRouter.bind(this, swagger)).to.not.throwError()
  }))

  it('should bind setup routes and controllers', co.wrap(function *() {
    const swagger = {
      swagger: '2.0',
      info: {
        title: 'api',
        version: '0.0.1',
      },
      paths: {
        '/test1': {
          get: {
            operationId: 'get',
            tags: ['test1'],
            responses: {
              200: { description: 'a', },
            },
          },
          post: {
            operationId: 'post',
            tags: ['test1'],
            responses: {
              200: { description: 'a', },
            },
          },
          delete: {
            operationId: 'delete',
            tags: ['test1'],
            responses: {
              200: { description: 'a', },
            },
          }
        },
        '/test2/{id}': {
          get: {
            operationId: 'get',
            tags: ['test2'],
            parameters: [
              {
                name: 'id',
                in: 'path',
                required: true,
                type: 'integer',
              },
            ],
            responses: {
              200: { description: 'a', },
            },
          },
        },
      },
    }
    const controllers = {
      test1: {
        get: function *(ctx, next) {
          ctx.body = { h: 'test1.get' }
        },
        post: function (ctx, next) {
          ctx.body = { h: 'test1.post' }
        },
      },
      test2: {
        get: co.wrap(function (ctx, id, next) {
          ctx.body = { h: 'test2.get', id }
        })
      },
    }
    const app = new Koa()
    app.silent = true
    app.use(middleware.errorHandler())
    app.use(bodyParser())
    app.use(middleware.swaggerRouter(swagger, controllers))
    const res1 = yield request(app.listen()).get('/test1').expect(200)
    expect(res1.body).to.eql({ h: 'test1.get' })
    const res2 = yield request(app.listen()).post('/test1').expect(200)
    expect(res2.body).to.eql({ h: 'test1.post' })
    const res3 = yield request(app.listen()).delete('/test1').expect(501)
    const res4 = yield request(app.listen()).get('/test2/123').expect(200)
    expect(res4.body).to.eql({ h: 'test2.get', id: 123 })
  }))

  it('should coerce and validate input', co.wrap(function *() {
    const swagger = {
      swagger: '2.0',
      info: {
        title: 'api',
        version: '0.0.1',
      },
      paths: {
        '/test/{p1}/{p2}/{p3}': {
          post: {
            operationId: 'post',
            tags: ['test'],
            parameters: [
              {
                name: 'p1',
                type: 'integer',
                in: 'path',
                required: true,
              },
              {
                name: 'p2',
                type: 'boolean',
                in: 'path',
                required: true,
              },
              {
                name: 'p3',
                type: 'number',
                format: 'float',
                in: 'path',
                required: true,
              },
              {
                name: 'body',
                in: 'body',
                schema: { $ref: '#/definitions/Test' },
              },
              {
                name: 'q1',
                type: 'integer',
                in: 'query',
                required: true,
              },
              {
                name: 'q2',
                type: 'boolean',
                in: 'query',
                required: true,
              },
              {
                name: 'q3',
                type: 'boolean',
                in: 'query',
                required: false,
              },
              {
                name: 'q4',
                type: 'boolean',
                in: 'query',
                required: true,
                default: false,
              },
            ],
            responses: {
              200: { description: 'a', },
            },
          },
        },
      },
      definitions: {
        Test: {
          required: ['a', 'b'],
          properties: {
            a: { type: 'integer' },
            b: { type: 'boolean' },
            c: { type: 'number', format: 'float' },
            d: { type: 'string', default: 'XXX' },
          },
        },
      },
    }
    const controllers = {
      test: {
        post: function (ctx, p1, p2, p3, next) {
          ctx.body = {
            body: ctx.request.body,
            query: ctx.request.query,
            p1,
            p2,
            p3,
          }
        },
      },
    }
    const app = new Koa()
    app.silent = true
    app.use(middleware.errorHandler())
    app.use(bodyParser())
    app.use(middleware.swaggerRouter(swagger, controllers))
    const res1 = yield request(app.listen())
    .post('/test/101/true/99.82?q1=102&q2=false&filtered_out=xxx')
    .set('Content-Type', 'application/json')
    .send({
      a: 198,
      b: false,
      c: '999.123',
      e: '<filtered_out>',
    })
    .expect(200)
    expect(res1.body).to.eql({
      body: {
        a: 198,
        b: false,
        c: 999.123,
        d: 'XXX',
      },
      query: {
        q1: 102,
        q2: false,
        q4: false,
      },
      p1: 101,
      p2: true,
      p3: 99.82,
    })
  }))

  it('should filter output if response schema is present', co.wrap(function *() {
    const swagger = {
      swagger: '2.0',
      info: {
        title: 'api',
        version: '0.0.1',
      },
      paths: {
        '/test': {
          get: {
            operationId: 'get',
            tags: ['test'],
            parameters: [],
            responses: {
              200: { description: 'a', schema: { $ref: '#/definitions/A' } },
            },
          },
        },
      },
      definitions: {
        A: {
          required: ['a', 'b'],
          properties: {
            a: { type: 'integer' },
            b: { type: 'boolean' },
            c: { type: 'number', format: 'float' },
            d: { type: 'string', default: 'XXX' },
            e: {
              type: 'object',
              properties: {
                e1: { type: 'string' },
              }
            },
          },
        },
      },
    }
    const controllers = {
      test: {
        get: function (ctx, next) {
          ctx.body = {
            a: 10,
            b: true,
            filtered_out: 'abc',
            e: {
              e1: 100,
              filtered_out: 'abc',
            },
          }
        },
      },
    }
    const app = new Koa()
    app.silent = true
    app.use(middleware.errorHandler())
    app.use(bodyParser())
    app.use(middleware.swaggerRouter(swagger, controllers))
    const res1 = yield request(app.listen())
    .get('/test')
    .set('Content-Type', 'application/json')
    .expect(200)
    expect(res1.body).to.eql({
      a: 10,
      b: true,
      e: {
        e1: 100,
      },
    })
  }))

  it('should filter output if response schema is present (respecting status code)', co.wrap(function *() {
    const swagger = {
      swagger: '2.0',
      info: {
        title: 'api',
        version: '0.0.1',
      },
      paths: {
        '/test': {
          get: {
            operationId: 'get',
            tags: ['test'],
            parameters: [],
            responses: {
              201: { description: 'a', schema: { $ref: '#/definitions/A' } },
            },
          },
        },
      },
      definitions: {
        A: {
          required: ['a', 'b'],
          properties: {
            a: { type: 'integer' },
            b: { type: 'boolean' },
            c: { type: 'number', format: 'float' },
            d: { type: 'string', default: 'XXX' },
            e: {
              type: 'object',
              properties: {
                e1: { type: 'string' },
              }
            },
          },
        },
      },
    }
    const controllers = {
      test: {
        get: function (ctx, next) {
          ctx.body = {
            a: 10,
            b: true,
            filtered_out: 'abc',
            e: {
              e1: 100,
              filtered_out: 'abc',
            },
          }
          ctx.status = 201
        },
      },
    }
    const app = new Koa()
    app.silent = true
    app.use(middleware.errorHandler())
    app.use(bodyParser())
    app.use(middleware.swaggerRouter(swagger, controllers))
    const res1 = yield request(app.listen())
    .get('/test')
    .set('Content-Type', 'application/json')
    .expect(201)
    expect(res1.body).to.eql({
      a: 10,
      b: true,
      e: {
        e1: 100,
      },
    })
  }))

  it('should NOT filter output if response schema is NOT present', co.wrap(function *() {
    const swagger = {
      swagger: '2.0',
      info: {
        title: 'api',
        version: '0.0.1',
      },
      paths: {
        '/test': {
          get: {
            operationId: 'get',
            tags: ['test'],
            parameters: [],
            responses: {
              201: { description: 'a', schema: { $ref: '#/definitions/A' } },
            },
          },
        },
      },
      definitions: {
        A: {
          required: ['a', 'b'],
          properties: {
            a: { type: 'integer' },
            b: { type: 'boolean' },
            c: { type: 'number', format: 'float' },
            d: { type: 'string', default: 'XXX' },
            e: {
              type: 'object',
              properties: {
                e1: { type: 'string' },
              }
            },
          },
        },
      },
    }
    const controllers = {
      test: {
        get: function (ctx, next) {
          ctx.body = {
            a: 10,
            b: true,
            filtered_out: 'abc',
            e: {
              e1: 100,
              filtered_out: 'abc',
            },
          }
        },
      },
    }
    const app = new Koa()
    app.silent = true
    app.use(middleware.errorHandler())
    app.use(bodyParser())
    app.use(middleware.swaggerRouter(swagger, controllers))
    const res1 = yield request(app.listen())
    .get('/test')
    .set('Content-Type', 'application/json')
    .expect(200)
    expect(res1.body).to.eql({
      a: 10,
      b: true,
      filtered_out: 'abc',
      e: {
        e1: 100,
        filtered_out: 'abc',
      },
    })
  }))

  it('should filter output if response schema is present (respecting status code)', co.wrap(function *() {
    const swagger = {
      swagger: '2.0',
      info: {
        title: 'api',
        version: '0.0.1',
      },
      paths: {
        '/test': {
          get: {
            operationId: 'get',
            tags: ['test'],
            parameters: [],
            responses: {
              201: { description: 'a', schema: { $ref: '#/definitions/A' } },
            },
          },
        },
      },
      definitions: {
        A: {
          required: ['a', 'b'],
          properties: {
            a: { type: 'integer' },
            b: { type: 'boolean' },
            c: { type: 'number', format: 'float' },
            d: { type: 'string', default: 'XXX' },
            e: {
              type: 'object',
              properties: {
                e1: { type: 'string' },
              }
            },
          },
        },
      },
    }
    const controllers = {
      test: {
        get: function (ctx, next) {
          ctx.body = {
            a: 10,
            b: true,
            filtered_out: 'abc',
            e: {
              e1: 100,
              filtered_out: 'abc',
            },
          }
          ctx.status = 201
        },
      },
    }
    const app = new Koa()
    app.silent = true
    app.use(middleware.errorHandler())
    app.use(bodyParser())
    app.use(middleware.swaggerRouter(swagger, controllers))
    const res1 = yield request(app.listen())
    .get('/test')
    .set('Content-Type', 'application/json')
    .expect(201)
    expect(res1.body).to.eql({
      a: 10,
      b: true,
      e: {
        e1: 100,
      },
    })
  }))

  it('should validate input', co.wrap(function *() {
    const swagger = {
      swagger: '2.0',
      info: {
        title: 'api',
        version: '0.0.1',
      },
      paths: {
        '/test/{p1}/{p2}/{p3}': {
          post: {
            operationId: 'post',
            tags: ['test'],
            parameters: [
              {
                name: 'p1',
                type: 'integer',
                in: 'path',
                required: true,
              },
              {
                name: 'p2',
                type: 'boolean',
                in: 'path',
                required: true,
              },
              {
                name: 'p3',
                type: 'number',
                format: 'float',
                in: 'path',
                required: true,
              },
              {
                name: 'body',
                in: 'body',
                schema: { $ref: '#/definitions/Test' },
              },
              {
                name: 'q1',
                type: 'integer',
                in: 'query',
                required: true,
              },
              {
                name: 'q2',
                type: 'boolean',
                in: 'query',
                required: true,
              },
              {
                name: 'q3',
                type: 'boolean',
                in: 'query',
                required: false,
              },
              {
                name: 'q4',
                type: 'boolean',
                in: 'query',
                required: true,
                default: false,
              },
            ],
            responses: {
              200: { description: 'a', },
            },
          },
        },
      },
      definitions: {
        Test: {
          required: ['a', 'b'],
          properties: {
            a: { type: 'integer' },
            b: { type: 'boolean' },
            c: { type: 'number', format: 'float' },
            d: { type: 'string', default: 'XXX' },
          },
        },
      },
    }
    const controllers = {
      test: {
        post: function (ctx, p1, p2, p3, next) {
          ctx.body = {
            body: ctx.request.body,
            query: ctx.request.query,
            p1,
            p2,
            p3,
          }
        },
      },
    }
    const app = new Koa()
    app.silent = true
    app.use(middleware.errorHandler())
    app.use(bodyParser())
    app.use(middleware.swaggerRouter(swagger, controllers))
    const res1 = yield request(app.listen())
    .post('/test/a/b/c?q1=d&q2=e&filtered_out=xxx')
    .set('Content-Type', 'application/json')
    .send({
      a: [],
      c: 'ppp',
      e: '<filtered_out>',
    })
    .expect(400)
    expect(res1.body).to.eql({
      statusCode: 400,
      message: 'Bad Request',
      code: 'badRequest',
      errors:
       [ { path: 'body.a',
           keyword: 'type',
           message: 'should be integer' },
         { path: 'body.b',
           keyword: 'required',
           message: 'propperty missing' },
         { path: 'body.c',
           keyword: 'type',
           message: 'should be number' },
         { path: 'query.q1',
           keyword: 'type',
           message: 'should be integer' },
         { path: 'query.q2',
           keyword: 'type',
           message: 'should be boolean' },
         { path: 'path.p1',
           keyword: 'type',
           message: 'should be integer' },
         { path: 'path.p2',
           keyword: 'type',
           message: 'should be boolean' },
         { path: 'path.p3',
           keyword: 'type',
           message: 'should be number' }
        ]
    })
  }))

})

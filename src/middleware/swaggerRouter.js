'use strict'

const Koa = require('koa')
const mount = require('koa-mount')
const route = require('koa-route')
const clone = require('clone')
const co = require('co')
const debug = require('debug')('apiStack:swaggerRouter')
const validateSchema = require('swagger-parser/lib/validate-schema')
const $RefParser = require('json-schema-ref-parser')
const dereference = require('json-schema-ref-parser/lib/dereference')
const pathToRegexp = require('path-to-regexp')
const Ajv = require('ajv')
const errors = require('./../apiErrors')
const buildApiSchema = require('./../utils/buildApiSchema')
const JsonFilter = require('./../utils/JsonFilter')

/**
 * Swagger router middleware.
 * @memberof module:middleware
 * @param {Object} swagger - swagger schema.
 * @param {Object} controllers - route controllers.
 * @param {Object} [options]
 * @returns {Function} KOA middleware
 */
const swaggerRouter = function (swagger, controllers, options) {
  swagger = swagger || {}
  options = options || {}
  const ajv = new Ajv({
    useDefaults: true,
    removeAdditional: 'all',
    coerceTypes: true,
    allErrors: true,
  })
  const formatError = function formatError (error) {
    const validationError = {
      path: error.dataPath.substr(1),
      keyword: error.keyword,
      message: error.message,
    }
    if (error.keyword === 'required') {
      validationError.path += `.${error.params.missingProperty}`
      validationError.message = `propperty missing`
    }
    return validationError
  }
  validateSchema(swagger)
  swagger = clone(swagger)
  const refParser = new $RefParser()
  refParser.schema = swagger
  refParser.$refs._add('', refParser.schema)
  dereference(refParser)
  const app = new Koa()
  Object.keys(swagger.paths).forEach(apiPath => {
    const koaPath = apiPath.replace(/(\{.+?\})/g, function (paramName) {
      return `:${paramName.slice(1, paramName.length - 1)}`
    })
    const ops = swagger.paths[apiPath]
    const pathParams = []
    const reg = pathToRegexp(koaPath, pathParams)
    Object.keys(ops).forEach(op => {
      const apiDesc = ops[op]
      const controller = apiDesc.tags[0]
      const operation = apiDesc.operationId
      if (!controllers || !controllers[controller] || !controllers[controller][operation]) {
        app.use(route[op](koaPath, function (ctx) {
          throw new errors.NotImplementedError()
        }))
        debug(`${op} ${koaPath} - handler not found`)
        return
      }
      const routeHandler = co.wrap(controllers[controller][operation])
      const apiSchema = buildApiSchema(apiDesc)
      const responseFilters = {}
      Object.keys(apiDesc.responses).forEach(statusCode => {
        if (apiDesc.responses[statusCode].schema) {
          responseFilters[statusCode] = new JsonFilter(apiDesc.responses[statusCode].schema)
        }
      })
      const validateRequest = ajv.compile(apiSchema)
      app.use(route[op](koaPath, function (ctx) {
        const next = arguments[arguments.length - 1]
        const requestData = {
          body: ctx.request.body,
          query: ctx.request.query,
          path: {},
        }
        pathParams.forEach((pathParam, idx) => {
          requestData.path[pathParam.name] = arguments[idx + 1]
        })
        const isValid = validateRequest(requestData)
        const args = pathParams.map(pathParam => {
          return requestData.path[pathParam.name]
        })
        args.unshift(ctx)
        args.push(next)
        if (isValid) {
          return routeHandler.apply(this, args)
          .then(function () {
            const resStatus = ctx.status || 200
            if (ctx.body && responseFilters[resStatus]) {
              responseFilters[`${resStatus}`].filter(ctx.body)
            }
          })
        } else {
          const validationErrors = validateRequest.errors.map(formatError)
          throw new errors.ValidationError(validationErrors)
        }
      }))
      debug(`${op} ${koaPath} - OK`)
    })
  })
  return mount('/', app)
}

module.exports = swaggerRouter

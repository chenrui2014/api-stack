'use strict'

const unless = require('koa-unless')
const serveStatic = require('koa-static')
const co = require('co')
const Koa = require('koa')
const route = require('koa-route')
const mount = require('koa-mount')
const path = require('path')
const fs = require('fs')

const uiPath = path.join(__dirname, '..', '..', 'node_modules', 'swagger-ui', 'dist')

/**
 * Swagger UI middleware.
 * @memberof module:middleware
 * @param {Object} [options]
 * @param {String} [options.schemaUrl] - URL of swagger schema (default /swagger.json)
 * @param {String} [options.apiKeyName] - name of header or query param (default "x-access-token")
 * @param {String} [options.apiKeyType] - "query" or "header" (default "header")
 * @returns {Function} KOA middleware
 */
const swaggerUI = function (options) {
  options = options || {}
  options.schemaUrl = options.schemaUrl || '/swagger.json'
  options.apiKeyName = options.apiKeyName || 'x-access-token'
  options.apiKeyType = options.apiKeyType || 'header'

  const indexHtml = fs.readFileSync(path.join(uiPath, 'index.html'))
  .toString()
  .replace('"http://petstore.swagger.io/v2/swagger.json"', JSON.stringify(options.schemaUrl))
  .replace(/ApiKeyAuthorization\(("api_key"), key, ("query")\)/, function () {
    return `ApiKeyAuthorization(${JSON.stringify(options.apiKeyName)}, key, ${JSON.stringify(options.apiKeyType)})`
  })

  const app = new Koa()
  app.use(route.get('/', function (ctx, next) {
    ctx.body = indexHtml
  }))
  app.use(serveStatic(uiPath))

  const middleware = mount('/', app)
  middleware.unless = unless
  return middleware
}

module.exports = swaggerUI

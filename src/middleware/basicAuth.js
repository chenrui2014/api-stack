'use strict'

const unless = require('koa-unless')
const auth = require('basic-auth')
const co = require('co')

const wwwAuth = function (ctx, realm) {
  realm = realm || 'realm'
  ctx.status = 401
  ctx.set('WWW-Authenticate', `Basic realm="${realm}"`)
  ctx.body = 'Access denied'
}

/**
 * Basic auth middleware.
 * @memberof module:middleware
 * @param {Function} authenticate - function which receives (ctx, { login, password }) arguments, must return true to allow access
 * @param {Object} [options]
 * @param {String} [options.realm] - name of Basic realm
 * @returns {Function} KOA middleware
 * @example
 * const basicAuth = require('api-stack/middleware').basicAuth
 *
 * app.use(basicAuth(function (ctx, credentials) {
 *   return credentials.login === 'admin' && credentials.password === 'qwerty'
 * }))
 */
const basicAuth = function (authenticate, options) {
  authenticate = co.wrap(authenticate)
  options = options || {}
  const realm = options.realm || 'realm'
  const middleware = co.wrap(function *(ctx, next) {
    const credentials = auth(ctx.request)
    if (!credentials || !(yield authenticate(ctx, {
      login: credentials.name,
      password: credentials.pass,
    }))) {
      ctx.status = 401
      ctx.set('WWW-Authenticate', `Basic realm="${realm}"`)
      ctx.body = 'Access denied'
    } else {
      yield next()
    }
  })
  middleware.unless = unless
  return middleware
}

module.exports = basicAuth

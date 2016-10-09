'use strict'

const selectn = require('selectn')
const unless = require('koa-unless')
const errors = require('./../apiErrors')

/**
 * Require authentication middleware.
 * @memberof module:middleware
 * @param {Object} [options]
 * @param {String} [payloadPath='user'] - payloadPath in ctx object.
 * @returns {Function} KOA middleware
 * @example
 * const requireAuth = require('api-stack/middleware').requireAuth
 *
 * app.use(requireAuth())
 *
 * app.use(function (ctx, next) {
 *   // this function won't run if user has not been authenticated
 *   console.log(ctx.user)
 *   return next()
 * })
 */
const requireAuth = function (options) {
  options = options || {}
  const payloadPath = options.payloadPath || 'user'
  const middleware = function requireAuth (ctx, next) {
    const payload = selectn(payloadPath, ctx)
    if (!payload) {
      throw new errors.UnauthorizedError()
    }
    return next()
  }
  middleware.unless = unless
  return middleware
}

module.exports = requireAuth

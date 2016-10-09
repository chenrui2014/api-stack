'use strict'

const dot = require('object-path')
const selectn = require('selectn')
const jwt = require('jsonwebtoken')
const unless = require('koa-unless')
const errors = require('./../apiErrors')

/**
 * Authentication middleware.
 * Handlers JWT acceess tokens.
 * @memberof module:middleware
 * @param {String} secret - Secret used to decrypt JWT.
 * @param {Object} [options]
 * @param {String} [options.tokenPath='request.headers.x-access-token'] - tokenPath in ctx object.
 * @param {String} [options.payloadPath='user'] - payloadPath in ctx object.
 * @param {Object} [options.jwtVerifyOptions] - options passed to JWT verification function (see {@link https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback})
 * @returns {Function} KOA middleware
 * @example
 * const authenticate = require('api-tools/middleware').authenticate
 *
 * app.use(authenticate('some-secret', {
 *   tokenPath: 'request.headers.x-access-token', // will look for token at ctx.headers.x-access-token
 *   payloadPath: 'user', // will save decoded payload at ctx.user
 *   jwtVerifyOptions: {},
 * }))
 *
 * app.use(function (ctx, next) {
 *   console.log(ctx.user) // will be null if accessToken was not provided in header
 *   return next()
 * })
 */
const authenticate = function authenticate (secret, options) {
  options = options || {}
  const tokenPath = options.tokenPath || 'request.headers.x-access-token'
  const payloadPath = options.payloadPath || 'user'
  const middleware = function authenticate (ctx, next) {
    const accessToken = selectn(tokenPath, ctx)
    let payload = null
    if (accessToken) {
      try {
        payload = jwt.verify(accessToken, secret, options.jwtVerifyOptions)
      } catch (err) {
        throw new errors.UnauthorizedError()
      }
    }
    dot.set(ctx, payloadPath, payload)
    return next()
  }
  middleware.unless = unless
  return middleware
}

module.exports = authenticate

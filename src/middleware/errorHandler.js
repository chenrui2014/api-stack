'use strict'

const co = require('co')
const unless = require('koa-unless')
const Boom = require('boom')
const _ = require('lodash')
const errors = require('./../apiErrors')

/**
 * Error handler middleware.
 * @memberof module:middleware
 * @returns {Function} KOA middleware
 * @example
 * const errorHandler = require('api-stack/middleware').errorHandler
 *
 * app.use(errorHandler())
 *
 */
const errorHandler = function (options) {
  options = options || {}
  const middleware = co.wrap(function *(ctx, next) {
    try {
      yield next()
      if (ctx.status === 404 && !ctx.body) {
        throw new errors.NotFoundError()
      }
    } catch (err) {
      if (err.name === 'SyntaxError') {
        err = new errors.ValidationError('body', 'type', 'Invalid JSON')
      }
      if (!err.isBoom) {
        Boom.wrap(err, 500)
      }
      const status = err.status = err.output.statusCode
      if (status >= 400) {
        ctx.app.emit('error', err, ctx)
      }
      ctx.status = status
      ctx.body = Object.assign({}, err.output.payload, {
        error: undefined,
        code: _.camelCase(err.output.payload.error),
        message: err.output.payload.error,
      }, err.data)
    }
  })
  middleware.unless = unless
  return middleware
}

module.exports = errorHandler

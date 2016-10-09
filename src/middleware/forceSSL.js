'use strict'

const convert = require('koa-convert')
const sslify = require('koa-sslify')
const unless = require('koa-unless')

/**
 * Force SSL.
 * Redirects HTTP to HTTPS.
 * @memberof module:middleware
 * @param {Object} options - options passed to [koa-sslify]{@url https://github.com/turboMaCk/koa-sslify#available-options}.
 * @returns {Function} KOA middleware
 * @example
 * const forceSSL = require('api-tools/middleware').forceSSL
 *
 * app.use(forceSSL({ trustProtoHeader: true }))
 */
const forceSSL = function forceSSL (options) {
  const middleware = convert(sslify(options))
  middleware.unless = unless
  return middleware
}

module.exports = forceSSL

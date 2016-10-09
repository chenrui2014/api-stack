'use strict'

/** @module middleware */
module.exports = {
  forceSSL: require('./forceSSL'),
  authenticate: require('./authenticate'),
  requireAuth: require('./requireAuth'),
  basicAuth: require('./basicAuth'),
  errorHandler: require('./errorHandler'),
  swaggerRouter: require('./swaggerRouter'),
  swaggerUI: require('./swaggerUI'),
}

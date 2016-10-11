'use strict'

/** @module sequelizePlugins */
module.exports = {
  initModelPlugin: require('./initModelPlugin'),
  initRelationsPlugin: require('./initRelationsPlugin'),
  toSwaggerPlugin: require('./toSwaggerPlugin'),
  hashedPlugin: require('./hashedPlugin'),
  safeRollbackPlugin: require('./safeRollbackPlugin'),
  dynamicAttributesPlugin: require('./dynamicAttributesPlugin'),
}

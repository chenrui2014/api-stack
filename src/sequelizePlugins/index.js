'use strict'

/** @module sequelizePlugins */
module.exports = {
  initModelPlugin: require('./initModelPlugin'),
  initRelationsPlugin: require('./initRelationsPlugin'),
  toSwaggerPlugin: require('./toSwaggerPlugin'),
  hashedPlugin: require('./hashedPlugin'),
  safeRollbackPlugin: require('./safeRollbackPlugin'),
  dynamicAttributesPlugin: require('./dynamicAttributesPlugin'),
  jsonifyPlugin: require('./jsonifyPlugin'),
  filtersPlugin: require('./filtersPlugin'),
  ftsPlugin: require('./ftsPlugin'),
}

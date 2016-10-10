'use strict'

/**
 * Transaction.prototype.safeRollback().
 * @memberof module:sequelizePlugins
 * @param {Sequelize} Sequelize - Sequelize library (not instance!)
 * @example
 * const Sequelize = require('sequelize')
 * require('api-stack').sequelizePlugins.safeRollback(Sequelize)
 *
 * const sequelize = new Sequelize(...)
 *
 *
 * const t = yield sequelize.transaction()
 * yield t.safeRollback()
 */
const safeRollbackPlugin = function (Sequelize) {
  Sequelize.Transaction.prototype.safeRollback = function () {
    if (this.finished) {
      return Promise.resolve()
    } else {
      return this.rollback()
    }
  }
}

module.exports = safeRollbackPlugin

'use strict'

/**
 * Init model from Model Class.
 * @memberof module:sequelizePlugins
 * @param {Sequelize} Sequelize - Sequelize library (not instance!)
 * @example
 * const Sequelize = require('sequelize')
 * require('api-stack').sequelizePlugins.initModelPlugin(Sequelize)
 *
 * const sequelize = new Sequelize(...)
 *
 * class User extends Sequelize.Model {
 *
 * }
 *
 * User.attributes = {
 *   attributes: { email: Sequelize.TEXT },
 * }
 *
 * User.options = {
 *   underscored: true,
 * }
 *
 * sequelize.initModel(User)
 */
const initModelPlugin = function (Sequelize) {
  Sequelize.prototype.initModel = function (ModelClass) {
    const attributes = ModelClass.attributes || {}
    const options = ModelClass.options || {}
    Object.assign(options, { sequelize: this })
    ModelClass.init(attributes, options)
    return ModelClass
  }
}

module.exports = initModelPlugin

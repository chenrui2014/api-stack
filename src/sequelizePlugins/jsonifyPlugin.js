'use strict'

const traverse = require('traverse')

/**
 * Init model from Model Class.
 * @memberof module:sequelizePlugins
 * @param {Sequelize} Sequelize - Sequelize library (not instance!)
 */
const jsonifyPlugin = function (Sequelize) {
  Sequelize.jsonify = function (obj) {
    traverse(obj).forEach(function (val) {
      if (val instanceof Sequelize.Model) {
        this.update(val.toJSON(), true)
      }
    })
  }
  Sequelize.addHook('afterInit', function (sequelize) {
    sequelize.jsonify = Sequelize.jsonify
  })
}

module.exports = jsonifyPlugin

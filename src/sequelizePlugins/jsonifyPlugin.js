'use strict'

const traverse = require('traverse')

/**
 * Init model from Model Class.
 * @memberof module:sequelizePlugins
 * @param {Sequelize} Sequelize - Sequelize library (not instance!)
 */
const jsonifyPlugin = function (Sequelize) {
  Sequelize.jsonify = function (obj) {
    if (obj instanceof Sequelize.Model) {
      return obj.toJSON()
    }
    traverse(obj).forEach(function (val) {
      if (val instanceof Sequelize.Model) {
        this.update(val.toJSON(), true)
      }
    })
    return obj
  }
  Sequelize.addHook('afterInit', function (sequelize) {
    sequelize.jsonify = Sequelize.jsonify
  })
}

module.exports = jsonifyPlugin

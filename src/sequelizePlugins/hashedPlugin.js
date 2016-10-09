'use strict'

const bcrypt = require('bcryptjs')

/**
 * Hash field before save.
 * @memberof module:sequelizePlugins
 * @param {Sequelize} Sequelize - Sequelize library (not instance!)
 * @example
 * const Sequelize = require('sequelize')
 * require('api-stack').sequelizePlugins.hashedPlugin(Sequelize)
 *
 * const sequelize = new Sequelize(...)
 *
 * const modelAttributes = {
 *  password: {
 *    type: Sequelize.TEXT,
 *    hashed: true, // will hash this attr before create/update
 *  },
 * }
 */
const hashedPlugin = function (Sequelize) {
  Sequelize.addHook('afterInit', function (sequelize) {
    sequelize.addHook('afterDefine', function (Model) {
      Object.keys(Model.attributes).forEach(function (key) {
        const attr = Model.attributes[key]
        if (attr.hashed) {
          Model.addHook('beforeSave', function (model, options) {
            if (typeof model.dataValues[key] === 'string') {
              const hash = bcrypt.hashSync(model.dataValues[key])
              model.dataValues[key] = hash
            }
          })
        }
      })
    })
  })
}

module.exports = hashedPlugin

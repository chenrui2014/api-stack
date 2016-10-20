'use strict'

/**
 * Filters plugin
 * @memberof module:sequelizePlugins
 * @param {Sequelize} Sequelize - Sequelize library (not instance!)
 */
const filtersPlugin = function (Sequelize) {
  Sequelize.addHook('afterInit', function (sequelize) {
    sequelize.addHook('afterDefine', function (Model) {
      Model.addHook('beforeFind', function (options) {
        if (options.filters) {
          const filters = Model.options.filters || {}
          Object.keys(filters).forEach(key => {
            if (Object.hasOwnProperty.call(options.filters, key)) {
              filters[key].call(Model, options.filters[key], options, options.filters)
            }
          })
        }
      })
    })
  })
}

module.exports = filtersPlugin

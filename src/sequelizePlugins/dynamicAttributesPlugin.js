
'use strict'

/**
 * Dynamic attributes.
 * @memberof module:sequelizePlugins
 * @param {Sequelize} Sequelize - Sequelize library (not instance!)
 */
const dynamicAttributesPlugin = function (Sequelize) {

  class Dynamic extends Sequelize.Utils.Literal {
    constructor (field, params) {
      super('')
      this.field = field
      this.params = params || {}
    }
  }
  const dynamic = function (field, options) {
    return new Dynamic(field, options)
  }
  Sequelize.Dynamic = Dynamic
  Sequelize.dynamic = dynamic

  Sequelize.addHook('afterInit', sequelize => {
    sequelize.Dynamic = Dynamic
    sequelize.dynamic = dynamic
    sequelize.addHook('afterDefine', function (Model) {
      Model.addHook('beforeFindAfterOptions', function (options) {
        handleDynamicAttributes(this, options, Dynamic)
      })
    })
  })
}

const handleDynamicAttributes = function (Model, options, Dynamic) {
  const dynamicAttrs = Object.keys(Model.attributes).filter(key => {
    return Model.attributes[key].dynamic
  })

  if (options.attributes) {
    options.attributes.forEach((attr, idx) => {
      if (attr instanceof Dynamic) {
        const generated = Model.attributes[attr.field].dynamic(attr.params, options)
        options.attributes[idx] = [generated, attr.field]
      }
    })
  }

  const includes = options.include || []
  includes.forEach(include => {
    handleDynamicAttributes(include.model, include, Dynamic)
  })
}

module.exports = dynamicAttributesPlugin

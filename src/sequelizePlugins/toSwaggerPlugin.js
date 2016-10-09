'use strict'

const isPlainObj = require('is-plain-object')
const pick = require('lodash.pick')

const swTypes = {}
swTypes.INTEGER = function (attr) { return { type: 'integer', format: 'int32' } }
swTypes.BIGINT = function (attr) { return { type: 'integer', format: 'int64' } }
swTypes.FLOAT = function (attr) { return { type: 'number', format: 'float' } }
swTypes.REAL = swTypes.NUMBER = swTypes.FLOAT
swTypes.DOUBLE = function (attr) { return { type: 'number', format: 'double' } }
swTypes['DOUBLE PRECISION'] = swTypes.DOUBLE
swTypes.STRING = function (attr) { return { type: 'string' } }
swTypes.TEXT = swTypes.CHAR = swTypes.UUID = swTypes.UUIDV1 = swTypes.UUIDV4 = swTypes.BLOB = swTypes.ENUM = swTypes.STRING
swTypes.DECIMAL = swTypes.NUMERIC = swTypes.STRING
swTypes.BOOLEAN = function (attr) { return { type: 'boolean' } }
swTypes.JSON = function (attr) { return { type: 'object' } }
swTypes.JSONB = swTypes.JSON
swTypes.DATE = function (attr) { return { type: 'string', format: 'date-time' } }
swTypes.DATEONLY = function (attr) { return { type: 'string', format: 'date' } }
swTypes.TIME = function (attr) { return { type: 'string', format: 'time' } }

const getSw = function (attr) {
  const sw = {}
  if (swTypes[attr.type.key]) {
    Object.assign(sw, swTypes[attr.type.key](attr))
  } else {
    sw.type = 'string'
  }
  if (attr.hasOwnProperty('defaultValue') &&
    (
      Array.isArray(attr.defaultValue)
      || isPlainObj(attr.defaultValue)
      || typeof attr.defaultValue === 'string'
      || typeof attr.defaultValue === 'number'
      || typeof attr.defaultValue === 'boolean'
      || attr.defaultValue === null
    )
  ) {
    sw.default = attr.defaultValue
  }
  if (attr.swagger) {
    Object.keys(attr.swagger).forEach(k => {
      if (k === undefined) {
        delete sw[k]
      } else {
        sw[k] = attr.swagger[k]
      }
    })
  }
  Object.keys(attr.validate || {}).forEach(key => {
    if (key === 'isEmail') {
      sw.format = 'email'
    } else if (key === 'len') {
      const len = attr.validate[key].args ? attr.validate[key].args[0] : attr.validate[key]
      if (len[0] !== null) {
        sw.minLength = len[0]
      }
      if (len[1] !== null) {
        sw.maxLength = len[1]
      }
    }
  })
  return sw
}

/*
TODO
'HSTORE',
'ARRAY',
'RANGE',
'GEOMETRY',
'GEOGRAPHY',
'postgres',
'mysql',
'sqlite',
'mssql' ]
*/

/**
 * Get swagger representation of model.
 * @memberof module:sequelizePlugins
 * @param {Sequelize} Sequelize - Sequelize library (not instance!)
 * @example
 * const Sequelize = require('sequelize')
 * require('api-stack').sequelizePlugins.toSwaggerPlugin(Sequelize)
 *
 * const sequelize = new Sequelize(...)
 *
 * const swagger1 = sequelize.model('User').toSwagger()
 * const swagger2 = sequelize.model('User').scope('public').toSwagger()
 */
const toSwaggerPlugin = function (Sequelize) {
  Sequelize.Model.toSwagger = function () {
    //console.log(this._scope)
    const swagger = {
      type: 'object',
      properties: {},
      required: [],
    }
    Object.keys(this.attributes).forEach(attrName => {
      const attr = this.attributes[attrName]
      swagger.properties[attrName] = getSw(attr)
    })
    if (!swagger.required.length) {
      delete swagger.required
    }
    if (this._scope && this._scope.attributes) {
      swagger.properties = pick(swagger.properties, this._scope.attributes)
    }
    return swagger
  }
}

module.exports = toSwaggerPlugin

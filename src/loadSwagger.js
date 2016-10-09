'use strict'

const swaggerJSDoc = require('swagger-jsdoc')
const fs = require('fs')
const path = require('path')

/**
 * Load swagger documentation from jsdocs
 * @memberof module:helpers
 * @param {String} controllersPath - path to diretcory containing controllers
 * @param {Object} swagger - swagger schema where to apply definitions from js docs
 */
const loadSwagger = function (controllersPath, swagger) {
  const files = fs.readdirSync(controllersPath).filter(filename => (
    filename.match(/\.js$/)
  )).map(filename => (
    path.join(controllersPath, filename)
  ))
  return swaggerJSDoc({
    swaggerDefinition: swagger,
    apis: files,
  })
}

module.exports = loadSwagger

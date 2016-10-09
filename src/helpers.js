'use strict'

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const loadSwagger = require('./loadSwagger')

/** @module helpers */

/**
 * Encode JWT
 * @memberof module:helpers
 * @param {Object} payload
 * @param {String} secret
 * @param {Object} [options]
 * @returns {String} JWT
 */
const encodeJWT = function (payload, secret, options) {
  return jwt.sign(payload, secret, options)
}

/**
 * verifyHash
 * @memberof module:helpers
 * @param {String} password
 * @param {String} hash
 * @returns {Boolean} verified?
 */
const verifyHash = function (password, hash) {
  return bcrypt.compareSync(password, hash)
}

module.exports = {
  encodeJWT,
  verifyHash,
  loadSwagger,
}

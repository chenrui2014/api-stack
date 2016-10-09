'use strict'

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const FB = require('fb')
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

/**
 * Get facebook profile
 * @memberof module:helpers
 * @param {String} fbAccessToken - facebook access token
 * @param {Object} [options]
 * @param {Array<String>} [options.fields] - fields to fetch
 * @param {String} [options.apiVersion] = "v2.7" - FB API version
 * @returns {Object} response from FB
 */
const getFacebookProfile = function (fbAccessToken, options) {
  options = options || {}
  options.fields = options.fields || [
    'id',
    'name',
    'gender',
    'email',
    'birthday',
    'bio',
    'cover',
    'about',
  ]
  options.apiVersion = options.apiVersion || 'v2.7'
  const apiOptions = {
    fields: options.fields,
    access_token: fbAccessToken,
  }
  return new Promise((resolve, reject) =>{
    FB.napi(`/${options.apiVersion}/me`, apiOptions, (err, res) => {
      if (err) { return reject(err) }
      resolve(res)
    })
  })
}

/**
 * Get facebook profile photo URL
 * @memberof module:helpers
 * @param {String} facebookId - facebook profile id
 * @param {Object} [options]
 * @param {String} [options.width] = "400" - photo width
 * @param {String} [options.height] = "400" - photo height
 * @param {String} [options.type] = "large" - photo type
 * @returns {Object} response from FB
 */
const getFacebookPhotoUrl = function (facebookId, options) {
  options = options || {}
  options.width = options.width || '400'
  options.height = options.height || '400'
  options.type = options.type || 'large'
  return `https://graph.facebook.com/${facebookId}/picture?type=${options.type}&width=${options.width}&height=${options.height}`
}

module.exports = {
  encodeJWT,
  verifyHash,
  loadSwagger,
  getFacebookProfile,
  getFacebookPhotoUrl,
}

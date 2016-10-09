'use strict'

/** @module apiErrors */

const Boom = require('boom')

/**
 * ApiError (bese error class)
 * @memberof module:apiErrors
 */
class ApiError extends Error {
  constructor (message) {
    super(message)
  }
}

/**
 * ValidationError (400)
 * @memberof module:apiErrors
 */
class ValidationError extends ApiError {
  constructor (path, keyword, message) {
    const mainMessage = 'Validation error'
    super(mainMessage)
    Boom.wrap(this, 400, mainMessage)
    if (Array.isArray(path)) {
      this.data = {
        errors: path.map(error => {
          return {
            path: error.path,
            keyword: error.keyword,
            message: error.message,
          }
        }),
      }
    } else {
      this.data = {
        errors: [
          {
            path,
            keyword,
            message,
          },
        ],
      }
    }
  }
}

/**
 * UnauthorizedError (401)
 * @memberof module:apiErrors
 */
class UnauthorizedError extends ApiError {
  constructor (message) {
    super(message)
    Boom.wrap(this, 401, message)
  }
}

/**
 * ForbiddenError (403)
 * @memberof module:apiErrors
 */
class ForbiddenError extends ApiError {
  constructor (message) {
    super(message)
    Boom.wrap(this, 403, message)
  }
}

/**
 * NotFoundError (404)
 * @memberof module:apiErrors
 */
class NotFoundError extends ApiError {
  constructor (message) {
    super(message)
    Boom.wrap(this, 404, message)
  }
}

/**
 * NotImplementedError (501)
 * @memberof module:apiErrors
 */
class NotImplementedError extends ApiError {
  constructor (message) {
    super(message)
    Boom.wrap(this, 501, message)
  }
}

module.exports = {
  ApiError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  NotImplementedError,
}

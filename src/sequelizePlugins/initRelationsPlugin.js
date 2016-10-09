'use strict'

/**
 * Init relations defined in Model Class.
 * @memberof module:sequelizePlugins
 * @param {Sequelize} Sequelize - Sequelize library (not instance!)
 * @example
 * const Sequelize = require('sequelize')
 * require('api-stack').sequelizePlugins.initRelationsPlugin(Sequelize)
 *
 * const sequelize = new Sequelize(...)
 *
 * class User extends Sequelize.Model {}
 * class Post extends Sequelize.Model {}
 * class Tag extends Sequelize.Model {}
 * class PostTag extends Sequelize.Model {}
 *
 * User.relations = {
 *   hasMany: { posts: { model: 'Post', foreignKey: 'postId' } },
 * }
 *
 * Post.relations = {
 *   belongsTo: { user: { model: 'User', foreignKey: 'postId' } },
 *   belongsToMany: { tags: { model: 'Tag', through: 'PostTag' } }
 * }
 *
 * sequelize.initRelations()
 */
const initRelationsPlugin = function (Sequelize) {
  Sequelize.prototype.initRelations = function () {
    Object.keys(this.models).forEach(modelName => {
      const ModelClass = this.model(modelName)

      if (ModelClass.relations) {
        ['hasMany', 'belongsTo', 'hasOne', 'belongsToMany'].forEach(relType => {
          if (ModelClass.relations[relType]) {
            Object.keys(ModelClass.relations[relType]).forEach(as => {
              const options = ModelClass.relations[relType][as]
              const model = this.model(options.model)
              const through = options.through ? this.model(options.through) : options.through
              ModelClass[relType](model, Object.assign(options, { model: undefined, as, through }))
            })
          }
        })
      }

      if (ModelClass.scopes) {
        Object.keys(ModelClass.scopes).forEach(scopeName => {
          const scopeOpts = normalizeScope(this, ModelClass.scopes[scopeName])
          ModelClass.addScope(scopeName, scopeOpts)
        })
      }

    })
  }
}

const normalizeScope = function (sequelize, scope) {
  if (scope.include) {
    scope.include.forEach(include => {
      if (include.model) {
        include.model = sequelize.model(include.model)
      }
      normalizeScope(sequelize, include)
    })
  }
  return scope
}

module.exports = initRelationsPlugin

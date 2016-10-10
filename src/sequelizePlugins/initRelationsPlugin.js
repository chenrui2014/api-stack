'use strict'

const toposort = require('toposort')
const debug = require('debug')('apiStack:initRelationsPlugin')

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

    // init relations
    Object.keys(this.models).forEach(modelName => {
      const ModelClass = this.model(modelName)
      if (ModelClass.relations) {
        ['hasMany', 'belongsTo', 'hasOne', 'belongsToMany'].forEach(relType => {
          if (ModelClass.relations[relType]) {
            Object.keys(ModelClass.relations[relType]).forEach(as => {
              const options = ModelClass.relations[relType][as]
              const model = this.model(options.model)
              const through = options.through ? (options.through.model ? Object.assign({}, options.through, { model: this.model(options.through.model) }) : this.model(options.through)) : options.through
              ModelClass[relType](model, Object.assign(options, { model: undefined, as, through }))
            })
          }
        })
      }
    })

    // toposort scope dependencies
    const depGraph = []
    Object.keys(this.models).forEach(modelName => {
      const ModelClass = this.model(modelName)
      getScopeDependencies(this, modelName).forEach(dep => {
        depGraph.push([ modelName, dep ])
      })
    })
    const modelList = toposort(depGraph).reverse()
    Object.keys(this.models).forEach(modelName => {
      if (modelList.indexOf(modelName) === -1) {
        modelList.push(modelName)
      }
    })

    // init scopes
    modelList.forEach(modelName => {
      const ModelClass = this.model(modelName)
      if (ModelClass.scopes) {
        Object.keys(ModelClass.scopes).forEach(scopeName => {
          const scopeOpts = normalizeScope(this, ModelClass.scopes[scopeName])
          ModelClass.addScope(scopeName, scopeOpts)
          debug(`${ModelClass.name}.addScope(${scopeName})`)
        })
      }

    })

  }
}

const getScopeDependencies = function (sequelize, modelName) {
  const ModelClass = sequelize.model(modelName)
  let deps = []
  if (ModelClass.scopes) {
    Object.keys(ModelClass.scopes).forEach(scopeName => {
      const scope = ModelClass.scopes[scopeName]
      if (scope.include) {
        scope.include.forEach(include => {
          deps.push(include.model)
          deps = deps.concat(getScopeDependencies(sequelize, include.model))
        })
      }
    })
  }
  return deps
}

const normalizeScope = function (sequelize, scope) {
  if (typeof scope === 'function') {
    return function () {
      const scopeOpts = scope.apply(this, arguments)
      return normalizeScope(sequelize, scopeOpts) 
    }
  }
  if (scope.include) {
    scope.include.forEach(include => {
      if (include.model) {
        include.model = sequelize.model(include.model)
        if (include.modelScope) {
          include.model = include.model.scope(include.modelScope)
          delete include.modelScope
        }
      }
      normalizeScope(sequelize, include)
    })
  }
  return scope
}

module.exports = initRelationsPlugin

'use strict'

const letters = ['A', 'B', 'C', 'D']

/**
 * FTS plugin
 * @memberof module:sequelizePlugins
 * @param {Sequelize} Sequelize - Sequelize library (not instance!)
 */
const ftsPlugin = function (Sequelize) {
  Sequelize.addHook('afterInit', function (sequelize) {
    sequelize.addHook('afterDefine', function (Model) {
      if (Model.options.fts) {
        const fields = Model.options.fts.fields
        Model.fts = function (term, options) {
          const terms = term.replace(/\s+/, ' ').split(/(\s)/).filter(term => !!term)
          if (!terms.length) { return options }
          options = options || {}
          options.where = options.where || {}
          options.where.$and = options.where.$and || []
          const vector = fields.map((field, idx) => {
            return `setweight(to_tsvector('simple', coalesce(${field}, '')), ${sequelize.escape(letters[idx])})`
          }).join(' || ')
          const tsQuery = terms.map(term => (`${sequelize.escape(term)}:*A*B*C*D`)).join('|')
          const toTsQuery = `to_tsquery('simple', $$${tsQuery}$$)`

          options.where.$and.push(sequelize.literal(`
            ${vector} @@ ${toTsQuery}
          `))
          options.order = [
            [sequelize.literal(`ts_rank('{0.1, 0.2, 0.4, 1.0}', ${vector}, ${toTsQuery})`), 'desc']
          ]
          return options
        }
      }
    })
  })
}

module.exports = ftsPlugin

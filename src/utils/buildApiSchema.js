'use strict'

const omit = require('lodash.omit')
const pick = require('lodash.pick')

const buildApiSchema = function (apiDesc) {
  const params = apiDesc.parameters || []
  const schema = {
    type: 'object',
    properties: {
      body: {},
      query: {
        properties: {},
      },
      path: {
        properties: {},
      },
    },
  }
  params.forEach(param => {
    if (param.in === 'body') {
      schema.properties.body = param.schema
    } else if (param.in === 'query' || param.in === 'path') {
      schema.properties[param.in].properties[param.name] = omit(param, ['required']) // TODO pick only JSON schema props?
      if (param.in === 'path' || param.required) {
        schema.properties[param.in].required = schema.properties[param.in].required || []
        schema.properties[param.in].required.push(param.name)
      }
    }
  })
  return schema
}

module.exports = buildApiSchema

'use strict'

const traverse = require('traverse')
const selectn = require('selectn')

const jsonMap = function (schema) {
  if (schema.type === 'object' || schema.properties) {
    const map = {}
    Object.keys(schema.properties).forEach(key => {
      map[key] = jsonMap(schema.properties[key])
    })
    return map
  } else if (schema.type === 'array') {
    return jsonMap(schema.items)
  } else {
    return true
  }
}

class JsonFilter {

  constructor (schema) {
    this.map = jsonMap(schema)
  }

  filter (data) {
    const self = this
    if (!data) { return }
    if (data && data.toJSON) {
      data = data.toJSON()
    }
    traverse(data).forEach(function (val) {
      if (!this.parent) { return }
      let node = this
      const parts = []
      while (node.parent) {
        if (!Array.isArray(node.parent.node)) {
            parts.unshift(node.key)
        }
        node = node.parent
      }
      if (!selectn(parts.join('.'), self.map)) {
        this.delete(true)
      }
    })
  }
}

module.exports = JsonFilter


const path = require('path')
const expect = require('expect.js')
const loadSwagger = require('./../src/loadSwagger')

const controllersPath = path.join(__dirname, 'controllers')

describe('loadSwagger', function () {

  it('should load swagger from controllers', function () {
    const swagger = loadSwagger(controllersPath, {
      info: {
        title: 'API',
        version: '0.0.1',
      },
    })
    expect(swagger).to.eql({
      "info": {
        "title": "API",
        "version": "0.0.1"
      },
      "swagger": "2.0",
      "paths": {
        "/posts": {
          "get": {
            "description": "List posts",
            "summary": "List posts",
            "operationId": "listPosts",
            "tags": [
              "posts"
            ],
            "parameters": [],
            "responses": {
              "200": {
                "description": "success"
              }
            }
          }
        },
        "/posts/{id}": {
          "get": {
            "description": "Read post",
            "summary": "Read post",
            "tags": [
              "posts"
            ],
            "parameters": [
              {
                "name": "id",
                "in": "path",
                "type": "integer"
              }
            ],
            "responses": {
              "200": {
                "description": "success"
              }
            }
          },
          "delete": {
            "description": "Delete post",
            "summary": "Delete post",
            "tags": [
              "posts"
            ],
            "parameters": [
              {
                "name": "id",
                "in": "path",
                "type": "integer"
              }
            ],
            "responses": {
              "204": {
                "description": "success"
              }
            }
          }
        },
        "/users": {
          "get": {
            "description": "List users",
            "summary": "List users",
            "tags": [
              "users"
            ],
            "parameters": [],
            "responses": {
              "200": {
                "description": "success"
              }
            }
          }
        },
        "/users/{id}": {
          "get": {
            "description": "Read user",
            "summary": "Read user",
            "tags": [
              "users"
            ],
            "parameters": [
              {
                "name": "id",
                "in": "path",
                "type": "integer"
              }
            ],
            "responses": {
              "200": {
                "description": "success"
              }
            }
          },
          "delete": {
            "description": "Delete user",
            "summary": "Delete user",
            "tags": [
              "users"
            ],
            "parameters": [
              {
                "name": "id",
                "in": "path",
                "type": "integer"
              }
            ],
            "responses": {
              "200": {
                "description": "success"
              }
            }
          }
        }
      },
      "definitions": {},
      "responses": {},
      "parameters": {},
      "securityDefinitions": {},
      "tags": []
    })
  })

  it('should respect swagger options passed to function', function () {
    const swagger = loadSwagger(controllersPath, {
      info: {
        title: 'API',
        version: '0.0.1',
      },
      paths: {
        '/test': {
          get: {
            "description": "List posts",
            "summary": "List posts",
            "x-custom-param": 'abc',
            "operationId": "listPosts",
            "tags": [
              "posts"
            ],
            "parameters": [],
            "responses": {
              "200": {
                "description": "success"
              }
            },
          },
        },
      },
    })
    expect(swagger).to.eql({
      "info": {
        "title": "API",
        "version": "0.0.1"
      },
      "swagger": "2.0",
      "paths": {
        "/test": {
          "get": {
            "description": "List posts",
            "summary": "List posts",
            "x-custom-param": 'abc',
            "operationId": "listPosts",
            "tags": [
              "posts"
            ],
            "parameters": [],
            "responses": {
              "200": {
                "description": "success"
              }
            }
          }
        },
        "/posts": {
          "get": {
            "description": "List posts",
            "summary": "List posts",
            "operationId": "listPosts",
            "tags": [
              "posts"
            ],
            "parameters": [],
            "responses": {
              "200": {
                "description": "success"
              }
            }
          }
        },
        "/posts/{id}": {
          "get": {
            "description": "Read post",
            "summary": "Read post",
            "tags": [
              "posts"
            ],
            "parameters": [
              {
                "name": "id",
                "in": "path",
                "type": "integer"
              }
            ],
            "responses": {
              "200": {
                "description": "success"
              }
            }
          },
          "delete": {
            "description": "Delete post",
            "summary": "Delete post",
            "tags": [
              "posts"
            ],
            "parameters": [
              {
                "name": "id",
                "in": "path",
                "type": "integer"
              }
            ],
            "responses": {
              "204": {
                "description": "success"
              }
            }
          }
        },
        "/users": {
          "get": {
            "description": "List users",
            "summary": "List users",
            "tags": [
              "users"
            ],
            "parameters": [],
            "responses": {
              "200": {
                "description": "success"
              }
            }
          }
        },
        "/users/{id}": {
          "get": {
            "description": "Read user",
            "summary": "Read user",
            "tags": [
              "users"
            ],
            "parameters": [
              {
                "name": "id",
                "in": "path",
                "type": "integer"
              }
            ],
            "responses": {
              "200": {
                "description": "success"
              }
            }
          },
          "delete": {
            "description": "Delete user",
            "summary": "Delete user",
            "tags": [
              "users"
            ],
            "parameters": [
              {
                "name": "id",
                "in": "path",
                "type": "integer"
              }
            ],
            "responses": {
              "200": {
                "description": "success"
              }
            }
          }
        }
      },
      "definitions": {},
      "responses": {},
      "parameters": {},
      "securityDefinitions": {},
      "tags": []
    })
  })

})

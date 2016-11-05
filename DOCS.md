
## API Reference


* [apiErrors](#module_apiErrors)
    * [.ApiError](#module_apiErrors.ApiError)
    * [.ValidationError](#module_apiErrors.ValidationError)
    * [.UnauthorizedError](#module_apiErrors.UnauthorizedError)
    * [.ForbiddenError](#module_apiErrors.ForbiddenError)
    * [.NotFoundError](#module_apiErrors.NotFoundError)
    * [.NotImplementedError](#module_apiErrors.NotImplementedError)


* [helpers](#module_helpers)
    * [.encodeJWT(payload, secret, [options])](#module_helpers.encodeJWT) ⇒ <code>String</code>
    * [.verifyHash(password, hash)](#module_helpers.verifyHash) ⇒ <code>Boolean</code>
    * [.getFacebookProfile(fbAccessToken, [options])](#module_helpers.getFacebookProfile) ⇒ <code>Object</code>
    * [.getFacebookPhotoUrl(facebookId, [options])](#module_helpers.getFacebookPhotoUrl) ⇒ <code>Object</code>
    * [.loadSwagger(controllersPath, swagger)](#module_helpers.loadSwagger)


* [middleware](#module_middleware)
    * [.authenticate(secret, [options])](#module_middleware.authenticate) ⇒ <code>function</code>
    * [.basicAuth(authenticate, [options])](#module_middleware.basicAuth) ⇒ <code>function</code>
    * [.errorHandler()](#module_middleware.errorHandler) ⇒ <code>function</code>
    * [.forceSSL(options)](#module_middleware.forceSSL) ⇒ <code>function</code>
    * [.requireAuth([options], [payloadPath])](#module_middleware.requireAuth) ⇒ <code>function</code>
    * [.swaggerRouter(swagger, controllers, [options])](#module_middleware.swaggerRouter) ⇒ <code>function</code>
    * [.swaggerUI([options])](#module_middleware.swaggerUI) ⇒ <code>function</code>


* [sequelizePlugins](#module_sequelizePlugins)
    * [.dynamicAttributesPlugin(Sequelize)](#module_sequelizePlugins.dynamicAttributesPlugin)
    * [.filtersPlugin(Sequelize)](#module_sequelizePlugins.filtersPlugin)
    * [.ftsPlugin(Sequelize)](#module_sequelizePlugins.ftsPlugin)
    * [.hashedPlugin(Sequelize)](#module_sequelizePlugins.hashedPlugin)
    * [.initModelPlugin(Sequelize)](#module_sequelizePlugins.initModelPlugin)
    * [.initRelationsPlugin(Sequelize)](#module_sequelizePlugins.initRelationsPlugin)
    * [.jsonifyPlugin(Sequelize)](#module_sequelizePlugins.jsonifyPlugin)
    * [.safeRollbackPlugin(Sequelize)](#module_sequelizePlugins.safeRollbackPlugin)
    * [.toSwaggerPlugin(Sequelize)](#module_sequelizePlugins.toSwaggerPlugin)


<a name="module_apiErrors"></a>

## apiErrors
<a name="module_apiErrors.ApiError"></a>

### apiErrors.ApiError
ApiError (bese error class)

**Kind**: static class of <code>[apiErrors](#module_apiErrors)</code>  
<a name="module_apiErrors.ValidationError"></a>

### apiErrors.ValidationError
ValidationError (400)

**Kind**: static class of <code>[apiErrors](#module_apiErrors)</code>  
<a name="module_apiErrors.UnauthorizedError"></a>

### apiErrors.UnauthorizedError
UnauthorizedError (401)

**Kind**: static class of <code>[apiErrors](#module_apiErrors)</code>  
<a name="module_apiErrors.ForbiddenError"></a>

### apiErrors.ForbiddenError
ForbiddenError (403)

**Kind**: static class of <code>[apiErrors](#module_apiErrors)</code>  
<a name="module_apiErrors.NotFoundError"></a>

### apiErrors.NotFoundError
NotFoundError (404)

**Kind**: static class of <code>[apiErrors](#module_apiErrors)</code>  
<a name="module_apiErrors.NotImplementedError"></a>

### apiErrors.NotImplementedError
NotImplementedError (501)

**Kind**: static class of <code>[apiErrors](#module_apiErrors)</code>  
<a name="module_apiStack"></a>

## apiStack
<a name="module_helpers"></a>

## helpers
<a name="module_helpers.encodeJWT"></a>

### helpers.encodeJWT(payload, secret, [options]) ⇒ <code>String</code>
Encode JWT

**Kind**: static method of <code>[helpers](#module_helpers)</code>  
**Returns**: <code>String</code> - JWT  

| Param | Type |
| --- | --- |
| payload | <code>Object</code> | 
| secret | <code>String</code> | 
| [options] | <code>Object</code> | 

<a name="module_helpers.verifyHash"></a>

### helpers.verifyHash(password, hash) ⇒ <code>Boolean</code>
verifyHash

**Kind**: static method of <code>[helpers](#module_helpers)</code>  
**Returns**: <code>Boolean</code> - verified?  

| Param | Type |
| --- | --- |
| password | <code>String</code> | 
| hash | <code>String</code> | 

<a name="module_helpers.getFacebookProfile"></a>

### helpers.getFacebookProfile(fbAccessToken, [options]) ⇒ <code>Object</code>
Get facebook profile

**Kind**: static method of <code>[helpers](#module_helpers)</code>  
**Returns**: <code>Object</code> - response from FB  

| Param | Type | Description |
| --- | --- | --- |
| fbAccessToken | <code>String</code> | facebook access token |
| [options] | <code>Object</code> |  |
| [options.fields] | <code>Array.&lt;String&gt;</code> | fields to fetch |
| [options.apiVersion] | <code>String</code> | = "v2.7" - FB API version |

<a name="module_helpers.getFacebookPhotoUrl"></a>

### helpers.getFacebookPhotoUrl(facebookId, [options]) ⇒ <code>Object</code>
Get facebook profile photo URL

**Kind**: static method of <code>[helpers](#module_helpers)</code>  
**Returns**: <code>Object</code> - response from FB  

| Param | Type | Description |
| --- | --- | --- |
| facebookId | <code>String</code> | facebook profile id |
| [options] | <code>Object</code> |  |
| [options.width] | <code>String</code> | = "400" - photo width |
| [options.height] | <code>String</code> | = "400" - photo height |
| [options.type] | <code>String</code> | = "large" - photo type |

<a name="module_helpers.loadSwagger"></a>

### helpers.loadSwagger(controllersPath, swagger)
Load swagger documentation from jsdocs

**Kind**: static method of <code>[helpers](#module_helpers)</code>  

| Param | Type | Description |
| --- | --- | --- |
| controllersPath | <code>String</code> | path to diretcory containing controllers |
| swagger | <code>Object</code> | swagger schema where to apply definitions from js docs |

<a name="module_middleware"></a>

## middleware
<a name="module_middleware.authenticate"></a>

### middleware.authenticate(secret, [options]) ⇒ <code>function</code>
Authentication middleware.
Handlers JWT acceess tokens.

**Kind**: static method of <code>[middleware](#module_middleware)</code>  
**Returns**: <code>function</code> - KOA middleware  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| secret | <code>String</code> |  | Secret used to decrypt JWT. |
| [options] | <code>Object</code> |  |  |
| [options.tokenPath] | <code>String</code> | <code>&#x27;request.headers.x-access-token&#x27;</code> | tokenPath in ctx object. |
| [options.payloadPath] | <code>String</code> | <code>&#x27;user&#x27;</code> | payloadPath in ctx object. |
| [options.jwtVerifyOptions] | <code>Object</code> |  | options passed to JWT verification function (see [https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback](https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback)) |

**Example**  
```js
const authenticate = require('api-tools/middleware').authenticate

app.use(authenticate('some-secret', {
  tokenPath: 'request.headers.x-access-token', // will look for token at ctx.headers.x-access-token
  payloadPath: 'user', // will save decoded payload at ctx.user
  jwtVerifyOptions: {},
}))

app.use(function (ctx, next) {
  console.log(ctx.user) // will be null if accessToken was not provided in header
  return next()
})
```
<a name="module_middleware.basicAuth"></a>

### middleware.basicAuth(authenticate, [options]) ⇒ <code>function</code>
Basic auth middleware.

**Kind**: static method of <code>[middleware](#module_middleware)</code>  
**Returns**: <code>function</code> - KOA middleware  

| Param | Type | Description |
| --- | --- | --- |
| authenticate | <code>function</code> | function which receives (ctx, { login, password }) arguments, must return true to allow access |
| [options] | <code>Object</code> |  |
| [options.realm] | <code>String</code> | name of Basic realm |

**Example**  
```js
const basicAuth = require('api-stack/middleware').basicAuth

app.use(basicAuth(function (ctx, credentials) {
  return credentials.login === 'admin' && credentials.password === 'qwerty'
}))
```
<a name="module_middleware.errorHandler"></a>

### middleware.errorHandler() ⇒ <code>function</code>
Error handler middleware.

**Kind**: static method of <code>[middleware](#module_middleware)</code>  
**Returns**: <code>function</code> - KOA middleware  
**Example**  
```js
const errorHandler = require('api-stack/middleware').errorHandler

app.use(errorHandler())
```
<a name="module_middleware.forceSSL"></a>

### middleware.forceSSL(options) ⇒ <code>function</code>
Force SSL.
Redirects HTTP to HTTPS.

**Kind**: static method of <code>[middleware](#module_middleware)</code>  
**Returns**: <code>function</code> - KOA middleware  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | options passed to [koa-sslify]{@url https://github.com/turboMaCk/koa-sslify#available-options}. |

**Example**  
```js
const forceSSL = require('api-tools/middleware').forceSSL

app.use(forceSSL({ trustProtoHeader: true }))
```
<a name="module_middleware.requireAuth"></a>

### middleware.requireAuth([options], [payloadPath]) ⇒ <code>function</code>
Require authentication middleware.

**Kind**: static method of <code>[middleware](#module_middleware)</code>  
**Returns**: <code>function</code> - KOA middleware  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> |  |  |
| [payloadPath] | <code>String</code> | <code>&#x27;user&#x27;</code> | payloadPath in ctx object. |

**Example**  
```js
const requireAuth = require('api-stack/middleware').requireAuth

app.use(requireAuth())

app.use(function (ctx, next) {
  // this function won't run if user has not been authenticated
  console.log(ctx.user)
  return next()
})
```
<a name="module_middleware.swaggerRouter"></a>

### middleware.swaggerRouter(swagger, controllers, [options]) ⇒ <code>function</code>
Swagger router middleware.

**Kind**: static method of <code>[middleware](#module_middleware)</code>  
**Returns**: <code>function</code> - KOA middleware  

| Param | Type | Description |
| --- | --- | --- |
| swagger | <code>Object</code> | swagger schema. |
| controllers | <code>Object</code> | route controllers. |
| [options] | <code>Object</code> |  |

<a name="module_middleware.swaggerUI"></a>

### middleware.swaggerUI([options]) ⇒ <code>function</code>
Swagger UI middleware.

**Kind**: static method of <code>[middleware](#module_middleware)</code>  
**Returns**: <code>function</code> - KOA middleware  

| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>Object</code> |  |
| [options.schemaUrl] | <code>String</code> | URL of swagger schema (default /swagger.json) |
| [options.apiKeyName] | <code>String</code> | name of header or query param (default "x-access-token") |
| [options.apiKeyType] | <code>String</code> | "query" or "header" (default "header") |

<a name="module_sequelizePlugins"></a>

## sequelizePlugins
<a name="module_sequelizePlugins.dynamicAttributesPlugin"></a>

### sequelizePlugins.dynamicAttributesPlugin(Sequelize)
Dynamic attributes.

**Kind**: static method of <code>[sequelizePlugins](#module_sequelizePlugins)</code>  

| Param | Type | Description |
| --- | --- | --- |
| Sequelize | <code>Sequelize</code> | Sequelize library (not instance!) |

<a name="module_sequelizePlugins.filtersPlugin"></a>

### sequelizePlugins.filtersPlugin(Sequelize)
Filters plugin

**Kind**: static method of <code>[sequelizePlugins](#module_sequelizePlugins)</code>  

| Param | Type | Description |
| --- | --- | --- |
| Sequelize | <code>Sequelize</code> | Sequelize library (not instance!) |

<a name="module_sequelizePlugins.ftsPlugin"></a>

### sequelizePlugins.ftsPlugin(Sequelize)
FTS plugin

**Kind**: static method of <code>[sequelizePlugins](#module_sequelizePlugins)</code>  

| Param | Type | Description |
| --- | --- | --- |
| Sequelize | <code>Sequelize</code> | Sequelize library (not instance!) |

<a name="module_sequelizePlugins.hashedPlugin"></a>

### sequelizePlugins.hashedPlugin(Sequelize)
Hash field before save.

**Kind**: static method of <code>[sequelizePlugins](#module_sequelizePlugins)</code>  

| Param | Type | Description |
| --- | --- | --- |
| Sequelize | <code>Sequelize</code> | Sequelize library (not instance!) |

**Example**  
```js
const Sequelize = require('sequelize')
require('api-stack').sequelizePlugins.hashedPlugin(Sequelize)

const sequelize = new Sequelize(...)

const modelAttributes = {
 password: {
   type: Sequelize.TEXT,
   hashed: true, // will hash this attr before create/update
 },
}
```
<a name="module_sequelizePlugins.initModelPlugin"></a>

### sequelizePlugins.initModelPlugin(Sequelize)
Init model from Model Class.

**Kind**: static method of <code>[sequelizePlugins](#module_sequelizePlugins)</code>  

| Param | Type | Description |
| --- | --- | --- |
| Sequelize | <code>Sequelize</code> | Sequelize library (not instance!) |

**Example**  
```js
const Sequelize = require('sequelize')
require('api-stack').sequelizePlugins.initModelPlugin(Sequelize)

const sequelize = new Sequelize(...)

class User extends Sequelize.Model {

}

User.attributes = {
  attributes: { email: Sequelize.TEXT },
}

User.options = {
  underscored: true,
}

sequelize.initModel(User)
```
<a name="module_sequelizePlugins.initRelationsPlugin"></a>

### sequelizePlugins.initRelationsPlugin(Sequelize)
Init relations defined in Model Class.

**Kind**: static method of <code>[sequelizePlugins](#module_sequelizePlugins)</code>  

| Param | Type | Description |
| --- | --- | --- |
| Sequelize | <code>Sequelize</code> | Sequelize library (not instance!) |

**Example**  
```js
const Sequelize = require('sequelize')
require('api-stack').sequelizePlugins.initRelationsPlugin(Sequelize)

const sequelize = new Sequelize(...)

class User extends Sequelize.Model {}
class Post extends Sequelize.Model {}
class Tag extends Sequelize.Model {}
class PostTag extends Sequelize.Model {}

User.relations = {
  hasMany: { posts: { model: 'Post', foreignKey: 'postId' } },
}

Post.relations = {
  belongsTo: { user: { model: 'User', foreignKey: 'postId' } },
  belongsToMany: { tags: { model: 'Tag', through: 'PostTag' } }
}

sequelize.initRelations()
```
<a name="module_sequelizePlugins.jsonifyPlugin"></a>

### sequelizePlugins.jsonifyPlugin(Sequelize)
Init model from Model Class.

**Kind**: static method of <code>[sequelizePlugins](#module_sequelizePlugins)</code>  

| Param | Type | Description |
| --- | --- | --- |
| Sequelize | <code>Sequelize</code> | Sequelize library (not instance!) |

<a name="module_sequelizePlugins.safeRollbackPlugin"></a>

### sequelizePlugins.safeRollbackPlugin(Sequelize)
Transaction.prototype.safeRollback().

**Kind**: static method of <code>[sequelizePlugins](#module_sequelizePlugins)</code>  

| Param | Type | Description |
| --- | --- | --- |
| Sequelize | <code>Sequelize</code> | Sequelize library (not instance!) |

**Example**  
```js
const Sequelize = require('sequelize')
require('api-stack').sequelizePlugins.safeRollback(Sequelize)

const sequelize = new Sequelize(...)


const t = yield sequelize.transaction()
yield t.safeRollback()
```
<a name="module_sequelizePlugins.toSwaggerPlugin"></a>

### sequelizePlugins.toSwaggerPlugin(Sequelize)
Get swagger representation of model.

**Kind**: static method of <code>[sequelizePlugins](#module_sequelizePlugins)</code>  

| Param | Type | Description |
| --- | --- | --- |
| Sequelize | <code>Sequelize</code> | Sequelize library (not instance!) |

**Example**  
```js
const Sequelize = require('sequelize')
require('api-stack').sequelizePlugins.toSwaggerPlugin(Sequelize)

const sequelize = new Sequelize(...)

const swagger1 = sequelize.model('User').toSwagger()
const swagger2 = sequelize.model('User').scope('public').toSwagger()
```

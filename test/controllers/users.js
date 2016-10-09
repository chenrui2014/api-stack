
/**
  * @swagger
  * /users:
  *   get:
  *     description: List users
  *     summary: List users
  *     tags:
  *     - users
  *     parameters: []
  *     responses:
  *       200:
  *         description: success
  */
const listUsers = function (ctx, next) {

}

/**
  * @swagger
  * /users/{id}:
  *   get:
  *     description: Read user
  *     summary: Read user
  *     tags:
  *     - users
  *     parameters:
  *       - name: id
  *         in: path
  *         type: integer
  *     responses:
  *       200:
  *         description: success
  */
const readUser = function (ctx, next) {

}

/**
  * @swagger
  * /users/{id}:
  *   delete:
  *     description: Delete user
  *     summary: Delete user
  *     tags:
  *     - users
  *     parameters:
  *       - name: id
  *         in: path
  *         type: integer
  *     responses:
  *       200:
  *         description: success
  */
const deleteUser = function (ctx, next) {

}

module.exports = {
  listUsers,
  readUser,
  deleteUser,
}

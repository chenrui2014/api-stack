
/**
  * @swagger
  * /posts:
  *   get:
  *     description: List posts
  *     summary: List posts
  *     operationId: listPosts
  *     tags:
  *     - posts
  *     parameters: []
  *     responses:
  *       200:
  *         description: success
  */
const listPosts = function (ctx, next) {

}

/**
  * @swagger
  * /posts/{id}:
  *   get:
  *     description: Read post
  *     summary: Read post
  *     tags:
  *     - posts
  *     parameters:
  *       - name: id
  *         in: path
  *         type: integer
  *     responses:
  *       200:
  *         description: success
  */
const readPost = function (ctx, next) {

}

/**
  * @swagger
  * /posts/{id}:
  *   delete:
  *     description: Delete post
  *     summary: Delete post
  *     tags:
  *     - posts
  *     parameters:
  *       - name: id
  *         in: path
  *         type: integer
  *     responses:
  *       204:
  *         description: success
  */
const deletePost = function (ctx, next) {

}

module.exports = {
  listPosts,
  readPost,
  deletePost,
}

import express from "express";
import data from "../../data";

const postRouter = express.Router();
postRouter.use(express.json()); // to use body object in requests




/**
 * @swagger
 *  tags:
 *    name: Posts
 *    description: posts of users
 */

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Returns all posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: the list of the posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *     security:
 *        - authorization: []
 */

postRouter.get("/", (req, res) => {
  res.send(data);
});

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: gets posts by id
 *     tags: [Posts]
 *     parameters:
 *       - in : path
 *         name: id
 *         description: id of post
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: posts by its id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: post can not be found
 *       401:
 *         description: Authtentication Fail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthFail'
 *     security:
 *        - authorization: []
 */

postRouter.get("/:id", (req, res) => {
  const post = data.find((post) => post.id === +req.params.id);

  if (!post) {
    res.sendStatus(404);
  }

  res.send(post);
});

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: The post was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       401:
 *         description: Authtentication Fail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthFail'
 *       500:
 *         description: Some server error
 *     security:
 *        - authorization: []
 */

postRouter.post("/", (req, res) => {
  try {
    const post = {
      ...req.body,
      id: data.length + 1,
    };

    data.push(post);

    res.send(post);
  } catch (error) {
    return res.status(500).send(error);
  }
});

/**
 * @swagger
 * /api/posts/{id}:
 *   put:
 *     summary: updates posts by id
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: post id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: The post was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       401:
 *         description: Authtentication Fail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthFail'
 *       404:
 *         description: post was not found.
 *       500:
 *         description: Some errors happend.
 *     security:
 *        - authorization: []
 */

postRouter.put("/:id", (req, res) => {
  try {
    let post = data.find((post) => post.id === +req.params.id);
    post.userId = req.body.userId;
    post.title = req.body.title;
    post.body = req.body.body;

    res.send(post);
  } catch (error) {
    return res.status(500).send(error);
  }
});

/**
 * @swagger
 *  /api/posts/{id}:
 *    delete:
 *      summary: removes post from array
 *      tags: [Posts]
 *      parameters:
 *        - in: path
 *          name: id
 *          description: post id
 *          required: true
 *          schema:
 *            type: integer
 *      responses:
 *        200:
 *          description: The post was deleted
 *        401:
 *         description: Authtentication Fail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthFail'
 *        404:
 *          description: The post was not found
 *      security:
 *        - authorization: []
 */

postRouter.delete("/:id", (req, res) => {
  let post = data.find((post) => post.id === +req.params.id);
  const index = data.indexOf(post);

  if (post) {
    data.splice(index, 1);
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

module.exports = postRouter;

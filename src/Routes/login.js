import express from 'express';
import { signToken } from '../utils/JWTtoken';

const loginRoute=express.Router();
loginRoute.use(express.json());



/**
 * @swagger
 * tags:
 *    name: Generals
 *    description: generic tags
 */

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login test
 *     tags: [Generals]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#components/schemas/Login'
 *     responses:
 *       200:
 *         description: Login Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/LoginRespone'
 *       500:
 *         description: Some server error
 */
loginRoute.post('/',async(req,res)=>{
    if(!req.body){
      return {
        message:'Missing Body'
      }
    }
    let signValue= signToken(req.body);
    res.send(signValue)
  })

  module.exports = loginRoute;
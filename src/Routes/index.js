import express from "express";
import authMiddleware from "../middleware/auth";
import postRouter from "./posts";
import loginRoute from "./login";
const allRouter = express.Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health Check
 *     tags: [Generals]
 *     responses:
 *       200:
 *         description: health Check for successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/healthcheckSuccessfully'
 *       500:
 *         description: health Check Fail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/healthcheckFail'
 */
allRouter.get('/health',async(req,res)=>{
    try {        
        res.status(200).send({
          message:'Health Check',
          description:'Health Check success'
        })
    } catch (error) {
        res.status(500).send({
            message:'Health Check Fail',
            description:'Health Check Fail'
          })  
    }
  })
allRouter.use('/login',loginRoute);
allRouter.use("/posts",authMiddleware,postRouter);


module.exports = allRouter;

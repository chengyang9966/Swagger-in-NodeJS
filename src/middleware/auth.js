import { validateToken } from "../utils/JWTtoken";

const authMiddleware=(req,res,next) => {
        var auth=req.headers['authorization']

        if(!auth){
            return res.status(401).send({
                message:'Authorization Fail',
                description:'Please Provide Auth Token'
              })
        }
        let token= auth.split('Bearer ')[1];
        if(!token){
            return res.status(401).send({
                message:'Token Wrong Format',
                description:'Token must be in Bearer format'
              })    
        }
        let resultToken= validateToken(token)
        if(resultToken && !resultToken.isValid){
            return res.status(401).send({
                message:'Token Auth Fail',
                description: resultToken.message
              })    
        }
        res.locals.userInfo=resultToken.tokenDecode
    

   return next()
    
}

export default authMiddleware;
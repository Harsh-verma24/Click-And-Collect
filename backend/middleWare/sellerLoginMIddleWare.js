const sellerLogin=require('../model/sellerLoginModel')
const jwt = require('jsonwebtoken');

const protect=async (req,res,next)=>{
    let token;
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            try{
                token=req.headers.authorization.split(" ")[1]
                const decode= jwt.verify(token,process.env.JWT_SECRET)
                req.user=await sellerLogin.findById(decode.id).select("-password")
                if(!req.user){
                   // user not found for provided token
                   return res.status(401).json({ msg: "User not found or token invalid" })
                }
                next()
            }
            catch(e){
                // token verification failed
                return res.status(401).json({ error: e.message })
           
           }
        
    }
    if(!token){
       return  res.status(401).json({ msg: "No token provided. Authorization required." })
    }
    
}

module.exports={protect}
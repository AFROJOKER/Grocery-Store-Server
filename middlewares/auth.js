const jwt = require("jsonwebtoken");

//User Authentication
exports.userAuth = async (req,res,next)=>{
    const token = req.header("x-api-key");

    if(!token){
        return res.status(400).json({error:"No Token Found!"});
    }
    try{
        const tokenData = jwt.verify(token, process.env.SECRET_KEY);
        req.tokenData = tokenData;
        next();

    }
    catch(err){
        console.log(err);
        res.status(502).json({err:"Token invalid or expired"})
    }
}

//Admin Authentication
exports.adminAuth = async (req,res, next)=>{
    const token = req.header("x-api-key");

    if(!token){
        return res.status(400).json({error:"No Token Found!"});
    }
    try{
        const tokenData = jwt.verify(token, process.env.SECRET_KEY);
        if(tokenData.role != "admin"){
            res.status(401).json({err:"Not an Admin Token!"})

        }
        req.tokenData = tokenData;
        next();

    }
    catch(err){
        console.log(err);
        res.status(502).json({err:"Token invalid or expired"})
    }
}
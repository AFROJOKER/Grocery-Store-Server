const jwt = require("jsonwebtoken");

exports.userAuth = async (req,res,next)=>{
    const token = req.cookies.user_token;

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

exports.adminAuth = async (req,res, next)=>{
    const token = req.cookies.admin_token;

    if(!token){
        return res.status(400).json({error:"No Admin Token Found!"});
    }
    try{
        const tokenData = jwt.verify(token, process.env.SECRET_ADMIN_KEY);
        req.tokenData = tokenData;
        next();

    }
    catch(err){
        console.log(err);
        res.status(502).json({err:"Token invalid or expired"})
    }
}
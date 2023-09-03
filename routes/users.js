const mongoose = require("mongoose");
const express = require("express");
const bcrypt = require('bcrypt');
const {UserModel, userValidation, loginValidation, createToken, createAdminToken} = require("../models/userModel");
const {userAuth} = require("../middlewares/auth");
const router = express.Router();

router.get("/",async (req,res)=>{
    try{
        const users = await UserModel.find({},{"name":1,"email":1,"_id":0});
        res.status(201).json(users);
    }
    catch(err){
        console.log(err);
        res.status(502).json({err})
    }
})


router.post("/", async (req,res)=>{
    const validateBody = userValidation(req.body);
    if(validateBody.error){
        return res.status(400).json({err:validateBody.error.details});
    }
    try{
        const user = new UserModel(req.body);
        user.password = await bcrypt.hash(user.password,10);

        const adminEmails = process.env.ADMIN_EMAILS.split(' ');
        if(adminEmails.includes(user.email))
        {
            user.role = "admin"
        }
        else{
            user.role = "user"
        }
        await user.save();

        user.password = "*****";
        res.status(201).json(user);
    }
    catch(err){
        if(err.code == 11000){
            return res.status(400).json("Email already exist!");
        }
        console.log(err);
        res.status(502).json({err})
        
    }
})

router.post("/login",async  (req,res)=>{
    const validateLogin = loginValidation(req.body);
    console.log(req.body);
    if(validateLogin.error){
        return res.status(400).json(validateLogin.error.details);
    }
    try{
        const user = await UserModel.findOne({email:req.body.email});
        if(!user){
            return res.status(402).json("Email not found!!");
        }
        
        const passValidate = await bcrypt.compare(req.body.password, user.password);

        if(!passValidate){
            return res.status(403).json("Wrong Password!");
        }

        const token = createToken(user._id);
        res.cookie("user_token", token,{maxAge:"100000000", httpOnly:true});

        const adminEmails = process.env.ADMIN_EMAILS.split(' ');
        if(adminEmails.includes(user.email))
        {
            const token = createAdminToken(user._id);
            res.cookie("admin_token", token,{maxAge:"100000000", httpOnly:true}); 
        }
        else{
            res.clearCookie("admin_token");
        }
        res.status(201).json(token);

    }
    catch(err){

        console.log(err);
        res.status(502).json({err})
    }
})


router.delete("/:id", userAuth,async(req,res)=>{
    try{
        if(req.tokenData._id == req.params.id){
            res.clearCookie("user_token");
            res.clearCookie("admin_token");
            
            const data = await UserModel.deleteOne({_id:req.params.id});
            res.status(200).json(data);
        }
        else{
            return res.status(400).json({err:"Trying to delete a different user than yours!"})
        }

    }
    catch(err){
        console.log(err);
        res.status(502).json({err})
    }

})
module.exports = router;
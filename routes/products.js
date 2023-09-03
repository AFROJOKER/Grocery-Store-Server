const mongoose = require("mongoose");
const express = require("express");
const {ProductModel, productValidation} = require("../models/productModel");
const router = express.Router();
const {userAuth, adminAuth} = require("../middlewares/auth");

router.get("/", async(req,res)=>{
    try{
        const limit = req.query.limit || 4;
        const page = req.query.page - 1 || 0;
        const sort = req.query.sort || "_id";
        const reverse = req.query.reverse == "yes"? -1: 1;
        const categories = req.query.categories && req.query.categories != "none"? JSON.parse(req.query.categories): false;
        console.log(categories);
        let filter = {};
        
        if(req.query.s){
            const searchExp = new RegExp(req.query.s, "i");
            if(categories){
                filter =  { $and:[{name: { $not: searchExp } },{categories:{$in: categories}}]};
            }
            else{
                filter = {$or:[{name:searchExp},{info:searchExp}]};

            }
        }
        
        const products = await ProductModel.find(filter).limit(limit).skip(page * limit).sort({[sort]:reverse});
        
        res.status(201).json(products);
    }
    catch(err){
        console.log(err);
        res.status(502).json({err})
    }
})

router.post("/", adminAuth,async(req,res)=>{
    const validateBody = productValidation(req.body);
    if(validateBody.error){
        res.status(400).json(validateBody.error.details);
    }
    try{
        const product = new ProductModel(req.body);
        await product.save();
        res.status(201).json(product);
    }
    catch(err){
        console.log(err);
        res.status(502).json({err})
    }
})

router.delete("/:id", adminAuth, async (req,res)=>{
    try{
        const data = await ProductModel.deleteOne({_id:req.params.id});

        res.status(200).json(data);
    }
    catch(err){
        console.log(err);
        res.status(502).json({err})
    }
})

module.exports = router;
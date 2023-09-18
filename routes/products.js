const mongoose = require("mongoose");
const express = require("express");
const {ProductModel, productValidation, productUpdateValidation} = require("../models/productModel");
const router = express.Router();
const {userAuth, adminAuth} = require("../middlewares/auth");


//Get Products
router.get("/", async(req,res)=>{
    try{
        const limit = req.query.limit || 4;
        const page = req.query.page - 1 || 0;
        const sort = req.query.sort || "_id";
        const reverse = req.query.reverse == "yes"? -1: 1;
        const categories = req.query.categories? JSON.parse(req.query.categories): undefined;
        const minPrice = req.query.min || 0;
        const maxPrice = req.query.max || Infinity;
        let filter = {};
        let conditions = [];

        //Adding Conditions to the Filter Object
        const searchExp = new RegExp(req.query.filter, "i");
        conditions.push({$or:[{name:searchExp},{info:searchExp}]});
        conditions.push({price:{$gte:minPrice, $lte:maxPrice}}) 
        categories && conditions.push({categories:{$in: categories}});
        filter.$and = conditions;
        
        const products = await ProductModel.find(filter).limit(limit).skip(page * limit).sort({[sort]:reverse});
        res.status(201).json(products);
    }
    catch(err){
            console.log(err);
        res.status(502).json({err})
    }
})

//Get Single Product
router.get("/single/:id", async(req,res)=>{
    try{     
        const product = await ProductModel.findOne({_id:req.params.id});

        res.status(201).json(product);
    }
    catch(err){
        console.log(err);
        res.status(502).json({err})
    }
})

//Create Product
router.post("/", adminAuth,async(req,res)=>{
    const validateBody = productValidation(req.body);
    if(validateBody.error){
        return res.status(400).json(validateBody.error.details);
    }
    try{
        const product = new ProductModel(req.body);
        product.user_id = req.tokenData._id;
        await product.save();
        res.status(201).json(product);
    }
    catch(err){
        console.log(err);
        res.status(502).json({err})
    }
})

//Update Product
router.put("/:editId", adminAuth, async(req,res)=>{
    const validateBody = productUpdateValidation(req.body)
    if(validateBody.error){
       return res.status(400).json(validateBody.error.details);
    }
    try{
        const data = await ProductModel.updateOne({_id:req.params.editId, user_id:req.tokenData._id},req.body);
        if(data.modifiedCount == 0){
            return res.status(201).json("Failed to Change Product(User ID of the Product doesn't Match the Current User's ID or Wrong Product ID)")
        }
        else{
            res.status(201).json("Successfully Updated Product");

        }
    }
    catch(err){
        console.log(err);
        res.status(502).json({err})
    }
})

//Delete Product
router.delete("/:delId", adminAuth, async (req,res)=>{
    try{
        const data = await ProductModel.deleteOne({_id:req.params.delId, user_id:req.tokenData._id});
        if(data.deletedCount == 0){
            return res.status(201).json("Failed to Delete Product(User ID of the Product doesn't Match the Current User's ID or Wrong Product ID)")
        }
        else{
            res.status(201).json("Successfully Deleted Product");

        }
    }
    catch(err){
        console.log(err);
        res.status(502).json({err})
    }
})

module.exports = router;
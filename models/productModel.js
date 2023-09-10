const mongoose = require("mongoose");
const joi = require("joi");


const productSchema = new mongoose.Schema({
    name:String,
    company:String,
    info:String,
    price:Number,
    img_url:{
        type:String, default:""
    },
    categories:{
        type:Array, default:[]
    },
    user_id:String

  },{timestamps:true})


exports.ProductModel = mongoose.model("products", productSchema);

exports.productValidation = (_reqbody) =>{
    const joiSchema = joi.object({
        name:joi.string().min(1).max(100).required(),
        company:joi.string().min(1).max(100).required(),
        info:joi.string().min(2).max(1000).required(),
        price:joi.number().min(1).max(1000).required(),
        img_url:joi.string().min(1).max(10000).allow(null,""),
        categories:joi.array().items(joi.string()).allow(null)
    })
    return joiSchema.validate(_reqbody);
}



exports.productUpdateValidation = (_reqbody) =>{
    const joiSchema = joi.object({
        name:joi.string().min(1).max(100).allow(null),
        company:joi.string().min(1).max(100).allow(null),
        info:joi.string().min(2).max(1000).allow(null),
        price:joi.number().min(1).max(1000).allow(null),
        img_url:joi.string().min(1).max(10000).allow(null,""),
        categories:joi.array().items(joi.string()).allow(null)
    })
    return joiSchema.validate(_reqbody);
}
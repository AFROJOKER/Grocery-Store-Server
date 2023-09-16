require("dotenv").config();
const express = require("express");
const cors = require('cors');
const app = express();
const userRoute = require('./routes/users');
const productRoute = require('./routes/products');
require("./db/mongoConnect");

app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{res.json("hi")})
app.use("/users",userRoute);
app.use("/products",productRoute);


const port = process.env.PORT || 3001;
app.listen(port);
//.env file configuration
require("dotenv").config();

//Required Imports
const express = require("express");
const path = require("path");   
const cors = require('cors');
const app = express();
const userRoute = require('./routes/users');
const productRoute = require('./routes/products');

//Running a file that connects to mongodb
require("./db/mongoConnect");

//Middlewares
app.use(express.static(path.join(__dirname, 'public')))
app.use(cors());
app.use(express.json());

//Setting up the routes
app.get("/",(req,res)=>{res.json("hi")})
app.use("/users",userRoute);
app.use("/products",productRoute);

//Running the server
const port = process.env.PORT || 3001;
app.listen(port);
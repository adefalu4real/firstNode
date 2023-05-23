require("dotenv").config();
const express = require("express");
const firstApp = express();
const morgan = require("morgan");
const mongoose = require("mongoose");

// Data base connection
//  To hide my database link
const dbLink = process.env.CONNECTION_STRING;

mongoose
  .connect(dbLink, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "eshop",
  })
  .then(() => {
    console.log("DATABASE CONNECT");
  })
  .catch((err) => {
    console.log(err);
  });

// console.log(api);
const api = process.env.API_URL;
console.log(api);

// middleware
firstApp.use(express.json());
firstApp.use(morgan("tiny"));

const productSchema = mongoose.Schema({
  name: String,
  image: String,
  countInStock: {
    type: Number,
    required: true,
  },
});

const Product = mongoose.model("Product", productSchema);

// routes
// get Method
firstApp.get(`${api}/products`, async (req, res) => {
  const productList = await Product.find();
  res.send(productList);
});

// post method
firstApp.post(`${api}/products`, (req, res) => {
  const product = new Product({
    name: req.body.name,
    image: req.body.image,
    countInStock: req.body.countInStock,
  });
  product
    .save()
    .then((createProduct) => {
      res.status(201).json(createProduct);
    })
    .catch((err) => {
      res.status(500).json({ error: err, success: false });
    });
});

// http://localhost:1999/api/v1/products

firstApp.listen(1999, () => {
  console.log(`server is running on http://localhost:1999`);
});

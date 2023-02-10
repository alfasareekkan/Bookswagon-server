import { Types } from "mongoose";
import uploadFile from "../utils/uploadFile.js"
import Product from "../model/Product.js";
import { json } from "express";
import Category from "../model/Category.js";



//add product
export const addProduct = async (req, res) => {
    const { title, description, price, categoryId,
        author, publisher, language, dateOfPublish, numberOfPages 
    }=req.body
    if (!req.file) {
        return res.status(400).send({ message: 'No file was selected' });
      }
    try {
        //upload file
        const result = await uploadFile(req.file.buffer)
        if (!result) throw new Error("Image uploading failed");

        //create new product
        const product = await Product.create({
            title, description, price, categoryId, author, publisher, language, dateOfPublish,
            numberOfPages, image: result.secure_url, imageId:result.public_id,
        })
        res.status(200).json(product)
    } catch (error) {
        res.status(500).send(error.message)
    }
}  

//get all products
export const geAllProduct = async (req, res) => {
    try {
        const products = await Product.find({ recordStatus: 0 })
        res.status(200).json(products)
    } catch (error) {
        res.status(500).send(error.message)

    }
}

export const deleteProduct = async (req, res) => {
    const categoryId = req.params.id
    try {
        const data = await Product.findOne({_id: categoryId })
        if (!data) throw new Error("Product not found")
        data.recordStatus = 2
        const result = await data.save();
        if(!result) throw new Error("Product not deleted")
        res.status(200).json({ message: `category of ${data.title} deleted` })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


//latest product

export const latestProduct = async (req, res) => { 
    try {
        const data=await Product.aggregate([
            {
              $match: {
                recordStatus: 0
              }
            }, {
              $match: {
                $expr: {
                  $gt: [
                    "$createdAt", {
                      $dateSubtract: {
                        'startDate': '$$NOW', 
                        'unit': 'week', 
                        'amount': 1
                      }
                    }
                  ]
                }
              }
            }, {
              $sort: {
                createdAt: -1
                },
            },
            {
              $limit: 10
            }
        ])
        if(!data) return res.status(204).send("data not found")
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

//get all products by category

export const productByCategory = async(req, res) => {
    const categoryId = req.params.id;
    if (!categoryId) return res.status(404).send("category not found");
    try {
        const data =await Category.aggregate([
            {
              $match: {
                _id: Types.ObjectId(categoryId),
              }
            },
            {
              $lookup :{
                from: 'products', 
                localField: '_id', 
                foreignField: 'categoryId', 
                as: 'products'
              }
            }, {
              $project: {
                _id: 0, 
                "products": 1
              }
            }, {
              $unwind: {
                path: '$products'
              }
            }, {
              $replaceRoot: {
                'newRoot': '$products'
              }
            }, {
              $limit: 10
            }
        ])
        if (!data) return res.status(204).send("data not found")
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
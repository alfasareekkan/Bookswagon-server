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
    //category id from request params
    const categoryId = req.params.id
    try {
        // product find from database
        const data = await Product.findOne({_id: categoryId })
        if (!data) throw new Error("Product not found")
        //change product status, record status equal to one mean delete (soft delete)
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
        //get latest product data from database
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

export const productByCategory = async (req, res) => {
         //check category id
    const categoryId = req.params.id;
    if (!categoryId) return res.status(404).send("category not found");
    try {
        // find all products by category from database
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
                category:1,
                "products": 1
              }
            }, {
              $unwind: {
                path: '$products'
              }
          },
          {
              $replaceRoot: {
                newRoot: {
                  $mergeObjects: ["$products","$$ROOT", ] 
                }
              }
          }
          , {
            $project: {
              "products":0,
            }
          }, {
              $limit: 4
            }
        ])  
        if (!data) return res.status(204).send("data not found")
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}


//filtering products by user aspects
export const getFilteredProducts = async(req, res) =>{
  const categoryId = req.params.id;
  const type = req.params.type;
  var sort;
  if (type === "AtoZ") {
    sort = {
      '$sort': {
        'title': 1
      }
    }
  }
  else if (type === "ZtoA") {
    sort = {
      '$sort': {
        'title': -1
      }
    }
  }
  else if (type === "LowToHigh") {
    sort = {
      '$sort': {
        'price': 1
      }
    }
  }
  else if (type === "HighToLow") { 
    sort={'$sort': {
      'price': -1
    }}
  }
  try {
    const result = await Product.aggregate([[
      {
        '$match': {
          'categoryId': Types.ObjectId(categoryId)
        }
      }, sort, {
        '$limit': 10
      }
    ]])
    if (!result) return result.status(204).send("data not found")
    res.status(200).json(result)

  } catch (error) {
    res.status(500).json({ error: error.message})
  }
}


export const getPaginateProducts =async (req, res) => {
  const { id, page } = req.params;
  const limit = 4;
  const skip = (page * limit) - limit;
  try {
    const data =await Category.aggregate([
      {
        $match: {
          _id: Types.ObjectId(id),
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
          category:1,
          "products": 1
        }
      }, {
        $unwind: {
          path: '$products'
        }
    },
    {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ["$products","$$ROOT", ] 
          }
        }
    }
    , {
      $project: {
        "products":0,
      }
      }, {
        $skip:skip
      },
      {
        $limit: limit
      }
  ])  
  if (!data) return res.status(204).send("data not found")
  res.status(200).json(data)
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message})
    
  }
}
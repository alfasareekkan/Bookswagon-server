import { Router } from "express";
import { latestProduct, productByCategory , getFilteredProducts} from "../controller/productController.js";
import { getAllCategory,  } from "../controller/categoryController.js";

const router = Router()


//latest product or last week product
router.get('/latest-products', latestProduct)
//product by category
router.get('/category-products/:id?',productByCategory)
//get All categories
router.get('/category', getAllCategory)
//filter products by A to z or Z to A
router.get('/filter/:id/:type', getFilteredProducts)

export default router
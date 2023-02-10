import { Router } from "express";
import { latestProduct, productByCategory } from "../controller/productController.js";

const router = Router()


//latest product or last week product
router.get('/latest-products', latestProduct)
router.get('/category-products/:id?',productByCategory)



export default router
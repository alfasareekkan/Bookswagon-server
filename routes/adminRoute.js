import { Router } from "express";
import { addCategory, getAllCategory,updateCategory,deleteCategory } from "../controller/categoryController.js"
import { addProduct, geAllProduct,deleteProduct } from "../controller/productController.js";
import upload from "../middleware/multer.js";

const router = Router()


//category management routes
router
    .route('/category/:id?')
    .get(getAllCategory)
    .post(addCategory)
    .patch(updateCategory)
    .delete(deleteCategory)

//product management routes

router
    .route('/product/:id?')
    .post(upload.single('file'), addProduct)
    .get(geAllProduct)
    .delete(deleteProduct)

export default router
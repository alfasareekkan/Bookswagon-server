import { Schema, model, } from "mongoose";


const schema = new Schema({
    title: {
        type: String,
        required:true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: "category",
    },
    author: {
        type: String,
        required: true,
    },
    publisher: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        required: true,
    },
    dateOfPublish: {
        type:Date,
        required: true,

    },
    numberOfPages: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    imageId: {
        type: String,
        required:true
    },
    recordStatus: {
        type: Number,
        default:0
    }

}, {
    timestamps:true
})

const productSchema = model("product", schema);
export default productSchema;

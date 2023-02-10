import { Schema, model } from "mongoose";

const schema = new Schema({
    category: {
        type: String,
        required: true
    },
    recordStatus: {
        type: Number,
        default:0
    }
}, {
    timestamps:true,
})

const categorySchema = model("category", schema)

export default categorySchema
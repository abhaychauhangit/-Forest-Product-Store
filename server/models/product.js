import mongoose from "mongoose";


const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: [
        {
            type: String,
            min: 0,
            required: true,
        }
    ],
    
    price: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: [true, "image is required"],
    },
    category: {
        type: String,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
}, {timestamps: true});



const Product = mongoose.model("Product", productSchema);

export default Product;
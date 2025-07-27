import cloudinary from "../lib/cloudinary.js";
import { redis } from "../lib/redis.js";
import Product from "../models/product.js";





export const getAllProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        console.log("in getAllproducts");
        const skip = (page - 1) * limit;
        const products = await Product.find({}).skip(skip).limit(limit);
        res.status(200).json(products)
    } catch (error) {
        console.log("error in getAllProducts controller", error.message);
        res.status(500).json({message: "internal server error", error: error.message})
    }

}


export const getFeaturedProducts = async (req, res) => {
    try {
        const featuredProducts = await redis.get("featuredProducts");
    
        if(featuredProducts) {
            return res.status(200).json(JSON.parse(featuredProducts));
        }
    
        featuredProducts = await Product.find({isFeatured: true}).lean();
        if(!featuredProducts) {
            res.status(404).json({message: "no featured products found"});
        }

        await redis.set("featuredProducts", JSON.stringify(featuredProducts));
    
        res.status(200).json(featuredProducts);
    } catch (error) {
        console.log("error in getFeaturedProducts controller", error.message);
        res.status(500).json({message: "internal server error", error: error.message})
    }
}


export const createProduct = async (req, res) => {
    try {
        const {name, description, price, category, image} = req.body;
    
        if(!name || !description || !price, !category, !image) {
            return res.status(400).json({message: "All fiels are required"});
        }
    
        let cloudinaryResponse = null;
        if(image) {
            cloudinaryResponse = await cloudinary.uploader.upload(image, {folder: "e-shop"});
        }
    
        const product = await Product.create({
            name,
            description,
            price,
            image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
            category,
        });
    
        res.status(201).json(product);
    } catch (error) {
        console.log("error in createProduct controller", error.message );
        res.status(500).json({message: "internal server error", error: error.message});
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
    
        if(!product) {
            return res.status(404).json({message: "no product found"});
        }
    
        if(product.image) {
            const publicId = product.image.split("/").pop().split(".")[0];
            try {
                await cloudinary.uploader.destroy(`e-shop/${publicId}`);
                console.log("deleted image from cloudinary");
            } catch (error) {
                console.log("error deleting image from cloduinary", error);
            }
        }
    
        await Product.findByIdAndDelete(req.params.id);
        res.status(201).json("product deleted successfully");
    } catch (error) {
        console.log("error in deleteProduct controller", error.message );
        res.status(500).json({message: "internal server error", error: error.message});
    }
}

export const getRecommendedProducts = async (req, res) => {
    try {
        const products = await Product.aggregate([
            {
                $sample: {size: 4}
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    price: 1,
                    image: 1,
                }
            }
        ])
    
        res.status(200).json(products);
    } catch (error) {
        console.log("error in getRecommendedProduct controller", error.message );
        res.status(500).json({message: "internal server error", error: error.message});
    }
} 


export const getProductByCategory = async (req, res) => {
   try {
     const {category} = req.params;
 
     const products = await Product.find({category});
 
     res.status(200).json(products);
   } catch (error) {
        console.log("error in getProductById controller", error.message );
        res.status(500).json({message: "internal server error", error: error.message});
   }
}

export const getSingleProduct = async (req, res) => {
    try {
        const {id} = req.params;
       
        const product = await Product.findOne({_id: id});
        
        res.status(200).json(product);
    } catch (error) {
        console.log("error in getSingleProduct controller", error.message );
        res.status(500).json({message: "internal server error", error: error.message});
    }
}


export const getSearchedProducts = async (req, res) => {
    try {
        const query = req.query.q;

        const regex = new RegExp(query, 'i');
        const products = await Product.find({
            $or: [
                {name: regex},
                {description: regex},
                {category: regex}
            ]
        });
        res.status(200).json(products);
    } catch (error) {
        console.log("error in getSearchedProducts controller", error.message );
        res.status(500).json({message: "internal server error", error: error.message});
    }
}

export const toggleFeaturedProduct = async (req, res) => {
    try {
        const products = await Product.findOne({_id: req.params.id});
    
        products.isFeatured = !products.isFeatured;
        await products.save();
        await updateFeaturedProductCache();
        res.status(200).json({products})
    } catch (error) {
        console.log("error in toggleFeaturedProduct controller", error.message );
        res.status(500).json({message: "internal server error", error: error.message});
    }


}


const updateFeaturedProductCache = async () => {
    try {
        const featuredProducts = await Product.find({isFeatured: true}).lean();
    
        await redis.set("featuredProducts", JSON.stringify(featuredProducts));
    } catch (error) {
        console.log("error in updateFeaturedProductCache", error.message);
    }
}
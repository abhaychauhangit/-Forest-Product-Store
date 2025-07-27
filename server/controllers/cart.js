import Product from "../models/product.js";


export const getCartItems = async (req, res) => {
    try {
        console.log("in getCartItems");

        // Ensure cartItems is always an array of proper objects
        const validCartItems = req.user?.cartItems?.filter(item => item && item.product);

        const productIds = validCartItems.map(item => item.product.toString());

        const products = await Product.find({ _id: { $in: productIds } });

        const productWithQuantity = products.map(product => {
            const cartItem = validCartItems.find(item => 
                item.product.toString() === product._id.toString()
            );

            return {
                ...product.toJSON(),
                quantity: cartItem?.quantity || 1,
            };
        });

        res.status(200).json(productWithQuantity);
    } catch (error) {
        console.log("error in getCartItems controller", error.message);
        res.status(500).json({message: "internal server error"});
    }

}

export const addProductToCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const existingProduct = req.user?.cartItems?.find((item) => item?.product?.toString() === productId);
    
        
        if(existingProduct) {
            existingProduct.quantity += 1; 
        } else {
            req.user.cartItems.push({product: productId});
        }
    
        await req.user.save()
        res.status(200).json(req.user.cartItems);
    } catch (error) {
        console.log("error in addProductToCart controller", error.message);
        res.status(500).json({message: "internal server error"});
    }
}

export const removeAllFromCArt = async (req, res) => {
    try {
        const {productId} = req.body;
        const user = req.user;
    
        if(!productId) {
            user.cartItems = [];
        } else {
            user.cartItems = user.cartItems.filter((item) => item.product !== productId );
        }
    
        await user.save();
        res.status(200).json(user.cartItems);
    } catch (error) {
        console.log("error in removeAllFromCArt controller", error.message);
        res.status(500).json({message: "internal server error"});
    }

}


export const updateQuantity = async (req, res) => {
    try {
        const {id: productId} = req.params;
        const {quantity} = req.body;
        console.log(quantity);
        const user = req.user;
        
        const validCartItems = req.user?.cartItems?.filter(item => item && item.product);
        
        const existingItem = validCartItems.find((item) => item.product.toString() === productId);
    
        if(existingItem) {
            if(quantity === 0) {
                user.cartItems = validCartItems.filter((item) => item.product.toString() !== productId);
                await user.save();
                res.status(200).json(user.cartItems)
            } else {
                existingItem.quantity = quantity;
                await user.save();
                res.status(200).json(user.cartItems)
            }
        } else {
            res.status(404).json({message: "product not found"});
        }
    } catch (error) {
        console.log("error in updateQuantity controller", error.message);
        res.status(500).json({message: "internal server error"});
    }
  
}
   
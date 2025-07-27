import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";




export const useCartStore = create((set,get) => ({
    cart: [],
    coupon: null,
    isCouponApplied: false,
    total: 0,
    subtotal: 0,
     
    getMyCoupon: async () => {
        try {
            const res = await axiosInstance.get("/coupons");
            set({coupon: res.data});
        } catch (error) {
            console.error("Error fetching coupon:", error);
        }
    },
    applyCoupon: async (code) => {
        try {
            const res = await axiosInstance.post("/coupons/validate", {code});
            set({coupon: res.data, isCouponApplied: true});
            get().calculateTotal();
        } catch (error) {
            console.error( error.response?.data?.message );
        }
    },
    removeCoupon: () => {
        set({coupon: null, isCouponApplied: false});
        get().calculateTotal();
        toast.success("Coupon removed");
    },

    getCartItems: async () => {
        try {
            console.log("client getCartItemns");
            const res = await axiosInstance.get("/cart");
            set({cart: res.data});
            get().calculateTotal();
        } catch (error) {
            set({cart: []});
            toast.error(error.response.data.message);
        }
    },
    
    clearCart: async () => {
        set({cart: [], coupon: null, total: 0, subtotal: 0});

    },

    addToCart: async (product) => {
        try {
            console.log(product._id);
            await axiosInstance.post("/cart", { productId: product._id });
            set((prevState) => {
				const existingItem = prevState.cart.find((item) => item._id === product._id);
				const newCart = existingItem
					? prevState.cart.map((item) =>
							item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
					  )
					: [...prevState.cart, { ...product, quantity: 1 }];
				return { cart: newCart };
			});
            get().calculateTotal();
        } catch (error) {
            toast.error(error?.response?.data?.message || "An error occurred");
        }
    },

    removeFromCart: async (productId) => {
        try {
            await axiosInstance.delete("/cart", {data: {productId}});
            set((prevState) => ({
                cart: prevState.cart.filter((item) => item._id !== productId)
            }))
            get().calculateTotal();
        } catch (error) {
            toast.error(error.response.data.message || "An error occurred");
        }
    },

    updateQuantity: async (productId, quantity) => {
        try {
            console.log(quantity);
            await axiosInstance.put(`/cart/${productId}`, {quantity});
            set((prevState) => ({
                cart: quantity === 0 ?  []     
                        : prevState.cart.map((item) => (item._id === productId ? { ...item, quantity } : item)),
            }));
            get().calculateTotal();
        } catch (error) {
            toast.error(error.response.data.message || "An error occurred");
        }
    },

    calculateTotal: () => {
        const {cart, coupon} = get();
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quanitity, 0);
        let total = 0;

        if(coupon) {
            total = subtotal - ((coupon.discountPercentage * subtotal)/100) 
        }

        set({total, subtotal});
    }

    

}))
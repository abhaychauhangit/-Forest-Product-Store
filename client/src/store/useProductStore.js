import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";





export const useProductStore = create((set, get) => ({
    products: [],
    isLoading: false,
    productDetails: null,
    searchedProducts: [],
    page: 1,
    hasMore: true,
    setProducts: (products) => set({products}),
    
    createProducts: async (product) => {
        set({isLoading: true});
        try {
            const res = await axiosInstance.post("/products", product);
            set((prevState) => ({
                products: [...prevState.products, res.data]
            }))
        } catch (error) {
            toast.error(error?.response?.data?.error);
            set({isLoading: false});
        } finally {
            set({isLoading: false});
        }

    },

    fetchAllProducts: async () => {
        if(get().isLoading || !get().hasMore) return;
        set({isLoading: true});

        try {
            const res = await axiosInstance.get(`/products?page=${get().page}&limit=10`);
            const newProducts = res.data;

            set((prevState) => ({
                products: [...prevState.products, ...newProducts],
                page: prevState.page + 1
            }));
            

            if (!newProducts.length || newProducts.length < 10) {
                set({hasMore: false});
            }
        } catch (error) {
            toast.error(error?.response?.data?.error || "error fetching products");
            set({isLoading: false});
        } finally {
            set({isLoading: false});
        }
    },

    fetchproductByCategory: async (category) => {
        set({isLoading: true});
        try {
            const res = await axiosInstance.get(`products/category/${category}`);
            set({products: res.data});
        } catch (error) {
            toast.error(error?.response?.data?.error);
            set({isLoading: false});
        } finally {
            set({isLoading: false});
        }
    },

    fetchSingleProduct: async (id) => {
        set({isLoading: true});
        try {
            const res = await axiosInstance.get(`/products/${id}`);
            set({productDetails: res.data});
        } catch (error) {
            toast.error(error?.response?.data?.error);
            set({isLoading: false});
        } finally {
            set({isLoading: false});
        }
    },

    fetchSearchedProducts: async (query) => {
        set({isLoading: true});
        try {
            const res = await axiosInstance.get(`/products/search?q=${query}`);
            set({searchedProducts: res.data})
        } catch (error) {
            toast.error(error?.response?.data?.error);
            set({isLoading: false});
        } finally {
            set({isLoading: false});
        }
    },

    deleteProduct: async (productId) => {
        set({isLoading: true});
        try {
            await axiosInstance.delete(`/products/${productId}`);
            set((prevState) => ({
                products: prevState.products.filter((p) => p._id !== productId)
            }));
        } catch (error) {
            toast.error(error?.response?.data?.error);
            set({isLoading: false});
        } finally {
            set({isLoading: false})
        }
    },

    toggleFeaturedProduct: async (productId) => {
        set({isLoading: true});
        try {
            const res = await axiosInstance.post(`/products/${productId}`);
            set((prevState) => ({
                products: prevState.products.map((product) => product._id === productId ? {...product, isfeatured: res.data.isfeatured} : product)
            }))
        } catch (error) {
            toast.error(error?.response?.data?.error);
            set({isLoading: false});
        } finally {
            set({isLoading: false})
        }
    },
     
    fetchFeaturedProducts: async () => {
        set({ isLoading: true });
		try {
			const res = await axiosInstance.get("/products/featured");
			set({ products: res.data });
		} catch (error) {
			set({ isLoading: false });
			console.log("Error fetching featured products:", error);
		} finally {
            set({isLoading: false})
        }
    },

    
}))

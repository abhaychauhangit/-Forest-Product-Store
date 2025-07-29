import {create} from "zustand";
import axiosInstance from "../lib/axios.js";
import {toast} from "react-hot-toast";


export const useUserStore = create((set, get) => ({
    user: null,
    loading: false,
    checkingAuth: false,

    signup: async ({fullName, email, password, confirmPassword}) => {
        set({loading: true});

        if(password !== confirmPassword) {
            set({loading: false});
            return toast.error("Passwords do not match");
        }

        try {
            const res = await axiosInstance.post("/auth/signup", {fullName, email, password});
            set({user: res.data});
        } catch (error) {
            set({loading: false});
            toast.error(error.response.data.message);
        } finally {
            set({loading: false});
        }
    },

    login: async ({email, password}) => {
        set({loading: true});

        try {
            const res = await axiosInstance.post("/auth/login", { email, password});
            set({user: res.data});
        } catch (error) {
            set({loading: false});
            toast.error(error.response.data.message);
        } finally {
            set({loading: false});
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({user: null});
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred during logout");
        }
    },

    checkAuth: async () => {
        set({checkingAuth: true});

        try {
            const res = await axiosInstance.get("/auth/checkauth")
            set({user: res.data});
        } catch (error) {
            console.log(error.message);
			set({ checkingAuth: false, user: null });
        } finally {
            set({checkingAuth: false})
        }
    },

    refreshToken: async () => {
        if(get().checkingAuth) return;

        set({checkingAuth: true}); 

        try {
            const res = await axiosInstance.post("/auth/refresh-token");
            set({checkingAuth: false});
            return res.data;
        } catch (error) {
            set({user: null, checkingAuth: false});
            throw error;
        }
    }
    
}));



let refreshPromise = null;

axiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				
				if (refreshPromise) {
					await refreshPromise;
					return axiosInstance(originalRequest);
				}

				// Start a new refresh process
				refreshPromise = useUserStore.getState().refreshToken();
				await refreshPromise;
				refreshPromise = null;

				return axiosInstance(originalRequest);
			} catch (refreshError) {
				// If refresh fails, redirect to login or handle as needed
				useUserStore.getState().logout();
				return Promise.reject(refreshError);
			}
		}
		return Promise.reject(error);
	}
);


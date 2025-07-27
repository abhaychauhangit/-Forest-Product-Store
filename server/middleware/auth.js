import jwt from "jsonwebtoken";
import User from "../models/user.js";



export const protectedRoute = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;
    
        if(!token) return res.status(401).json({message: "unauthorized no access token found"});
    
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
        
        const user = await User.findOne({_id: decoded.userId}).select("-password");
    
        if(!user) return res.status(404).json({message: "user not found"});

        req.user = user;   
        next();
    } catch (error) {
        console.log("error in protectedRoute middleware", error.message);
        res.status(401).json({message: "unauthorized no access token found"});

    }
} 

export const adminRoute = (req, res, next) => {
    if(req.user && req.user.role === "admin") {
        next();
    } else {
        return res.status(403).json({message: "access denied admin only"});
    }

}
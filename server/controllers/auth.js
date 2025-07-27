import jwt from "jsonwebtoken";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { redis } from "../lib/redis.js";



const generateToken = (userId) => {
    const accessToken = jwt.sign({userId}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
    })

    const refreshToken = jwt.sign({userId}, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d",
    })
    return {accessToken, refreshToken};
}

const storeRefreshToken = async (userId, refreshToken) => {
    await redis.set(`refreshToken:${userId}`, refreshToken, "EX", 7*24*60*60);
}

const setCookies = (accessToken, refreshToken, res) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
}

export const signup = async (req, res) => {
    try {
        const {fullName, email, password} = req.body;
    
        if(!fullName || !email || !password) {
           return res.status(400).json({message: "All fields are required"});
        }

        if(password.length < 6 ) {
           return res.status(400).json({message: "password length must be greater than 6 characters"});
        }
    
        const userAlreadyExists = await User.findOne({email});  
    
        if(userAlreadyExists) {
            return res.status(400).json({message: "User already exists"});
        }
    
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
    
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        })
        
        if(newUser) {
            const {accessToken, refreshToken} = generateToken(newUser._id);
            await newUser.save();

            await storeRefreshToken(newUser._id, refreshToken);
            setCookies(accessToken, refreshToken, res);
    
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            })
        } else {
            res.status(400).json({message: "Invalid User Data"});
        }
    } catch (error) {
        console.log("error in signup controller", error.message);
        res.status(500).json({message: "Internal Server Error"})
    }
}
export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
    
        if(!email || !password) {
            res.status(400).json({message: "All fields are required"});
        }

        if(password.length < 6 ) {
            return res.status(400).json({message: "password length must be greater than 6 characters"});
        }
    
        const user = await User.findOne({email});  
    
        if(!user) {
            res.status(400).json({message: "User does not exists"});
        }
    
        const passwordIsCorrect = await bcrypt.compare(password, user.password)
        
        if(!passwordIsCorrect) {
            return res.status(400).json({message: "Password is incorrect"});
        }
       
        const {accessToken, refreshToken} = generateToken(user._id);
        storeRefreshToken(user._id, refreshToken);
        setCookies(accessToken, refreshToken, res);
        

        res.status(201).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        })
    
            
    
    } catch (error) {
        console.log("error in login controller", error.message);
        res.status(500).json({message: "Internal Server Error"})
    }
}

export const logout = async (req, res) => {
    try {
        console.log("in logout");
        const refreshToken = req.cookies.refreshToken;
        if(refreshToken) {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            await redis.del(`refreshToken:${decoded.userId}`)
        }

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.status(200).json({message: "user logged out successfully"});
    } catch (error) {
        console.log("error in logout controller", error.message);
        res.status(500).json({message: "internal server error"});
    }
}


export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        res.status(500).json({message: "internal server error",error: error.message});
    }
}
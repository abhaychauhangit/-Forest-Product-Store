import dotenv from "dotenv";
import mongoose from "mongoose";


dotenv.config();

export const connectDB = async () => {
    try {
        const connect = await mongoose.connect("mongodb+srv://abhaychauhan5454:5EpEhAjQVSJHGq6c@cluster0.uh3eva9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
        console.log(`MongoDB connected: ${connect.connection.host}`);
    } catch (error) {
        console.log("error connecting in MongoDB", error);
        process.exit(1)
    }
}
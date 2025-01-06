import mongoose from 'mongoose';
import "dotenv/config";

// dotenv.config();

console.log("Mongo db uri:- ",process.env.MONGODB_URI);


const connectDB = async () => {
    try {
     const connectionInstance = await mongoose.connect(
       `${process.env.MONGODB_URI}/${process.env.DB_NAME}`
     );
     console.log("Database Connected successfully:- ", connectionInstance.connection.host);
    } catch (error) {
        console.log("Error connecting the database!!", error);
        process.exit(1);
    }
}

export default connectDB;
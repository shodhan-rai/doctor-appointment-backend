import mongoose from "mongoose";

const connectDB = async () => {
  mongoose.connection.on("connected", () => console.log("Database Connected"));

  await mongoose.connect('mongodb+srv://doctorapp:doctorapp@appointmenrapp.sprw34g.mongodb.net/?retryWrites=true&w=majority&appName=appointmenrapp');
};

export default connectDB;

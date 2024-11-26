import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

// Routes
import authRoutes from "./routes/authRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use("/auth", authRoutes);

app.use(errorHandler);

const PORT = process.env.PORT | 5000;
app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT} `);
});

import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";

import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(cookieParser());
app.use(express.json());

const PORT = process.env.PORT | 5000;
app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT} `);
});

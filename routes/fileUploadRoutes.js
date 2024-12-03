import express from "express";
import upload from "../middlewares/fileUpload.js";
import authenticateWithJWT from "../middlewares/authenticateWithJWT.js";

const router = express.Router();

router.post("/", authenticateWithJWT, upload.single("file"), (req, res) => {
  if (req.file) {
    res.json({ filename: req.file.filename });
  } else {
    next(new Error("File could not be uploaded !"));
  }
});

export default router;

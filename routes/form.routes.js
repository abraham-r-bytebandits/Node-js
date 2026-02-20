import express from "express";
import upload from "../config/multer.js";
import { submitForm } from "../controllers/form.controller.js";

const router = express.Router();

router.post("/", upload.single("file"), submitForm);

export default router;

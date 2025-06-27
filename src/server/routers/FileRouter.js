import controller from "../controllers/FileController.js";
import { Router } from "express";
import { uploadImage, uploadPdf } from "../common/uploadMiddleware.js";

const router = Router();

router.post("/upload-image", uploadImage.single("file"), controller.upload);
router.post("/upload-pdf", uploadPdf.single("file"), controller.upload);

export default router;

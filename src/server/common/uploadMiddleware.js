import multer from "multer";
import path from "path";
import { getTempFolder } from "../services/FileService.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, getTempFolder());
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, "temp-" + file.fieldname + "-" + uniqueSuffix + ext);
  },
});

// File filter para imágenes
const imageFilter = (req, file, cb) => {
  if (/^image\/(jpeg|png|gif|webp)$/.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten imágenes"), false);
  }
};

// File filter para PDFs
const pdfFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten archivos PDF"), false);
  }
};

// Middlewares separados
export const uploadImage = multer({ storage, fileFilter: imageFilter });
export const uploadPdf = multer({ storage, fileFilter: pdfFilter });

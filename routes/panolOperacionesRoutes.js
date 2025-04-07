import express from "express";
import multer from "multer";
import { protect } from "../middleware/authMiddleware.js";
import {
  importarDesdeExcelController,
  asignarMaterialesController,
} from "../controllers/panolOperacionesController.js";

const router = express.Router();
const upload = multer(); // usamos memoria para recibir archivos Excel

// 📥 Importar materiales desde Excel (por tipo)
router.post("/importar/:tipo", protect, upload.single("file"), importarDesdeExcelController);

// 📦 Asignar materiales a obra manualmente (por tipo)
router.post("/asignar/:tipo", protect, asignarMaterialesController);

export default router;

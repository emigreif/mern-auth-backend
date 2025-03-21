import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { importarPerfilesDesdeExcel, importarVidriosDesdeExcel } from "../controllers/generalController.js";

import { agregarPerfilGeneral, obtenerPerfilesGenerales, agregarVidrioGeneral, obtenerVidriosGenerales } from "../controllers/generalController.js";

const router = express.Router();

// 📌 Rutas de Perfiles Generales
router.get("/perfiles", obtenerPerfilesGenerales);
router.post("/perfiles", agregarPerfilGeneral);

// 📌 Rutas de Vidrios Generales
router.get("/vidrios", obtenerVidriosGenerales);
router.post("/vidrios", agregarVidrioGeneral);

// 📌 Rutas de Importación desde Excel
router.post("/perfiles/importar", upload.single("file"), importarPerfilesDesdeExcel);
router.post("/vidrios/importar", upload.single("file"), importarVidriosDesdeExcel);


export default router;

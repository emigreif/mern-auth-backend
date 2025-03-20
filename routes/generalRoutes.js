import express from "express";
import { agregarPerfilGeneral, obtenerPerfilesGenerales, agregarVidrioGeneral, obtenerVidriosGenerales } from "../controllers/generalController.js";

const router = express.Router();

// 📌 Rutas de Perfiles Generales
router.get("/perfiles", obtenerPerfilesGenerales);
router.post("/perfiles", agregarPerfilGeneral);

// 📌 Rutas de Vidrios Generales
router.get("/vidrios", obtenerVidriosGenerales);
router.post("/vidrios", agregarVidrioGeneral);

export default router;

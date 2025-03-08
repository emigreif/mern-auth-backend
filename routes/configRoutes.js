import express from "express";
import { obtenerConfiguracion, actualizarConfiguracion } from "../controllers/configController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 📌 Ruta para obtener la configuración del usuario autenticado
router.get("/", protect, obtenerConfiguracion);

// 📌 Ruta para actualizar la configuración
router.put("/", protect, actualizarConfiguracion);

export default router;

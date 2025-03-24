import express from "express";
import {
  crearTipologia,
  modificarTipologia,
  eliminarTipologia,
  agruparTipologias,
  importarTipologiasDesdeExcel,
  obtenerTipologias
} from "../controllers/tipologiaController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", protect, obtenerTipologias);
router.post("/", protect, crearTipologia);
router.put("/:id", protect, modificarTipologia);
router.delete("/:id", protect, eliminarTipologia);
router.post("/importar", protect, upload.single("file"), importarTipologiasDesdeExcel);
router.post("/agrupar", protect, agruparTipologias);

export default router;

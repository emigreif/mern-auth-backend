import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  listarTipologias,
  obtenerTipologia,
  crearTipologia,
  actualizarTipologia,
  eliminarTipologia,
  agruparTipologias
} from "../controllers/tipologiaController.js";

const router = express.Router();

router.get("/", protect, listarTipologias);
router.get("/:id", protect, obtenerTipologia);
router.post("/", protect, crearTipologia);
router.put("/:id", protect, actualizarTipologia);
router.delete("/:id", protect, eliminarTipologia);
router.post("/agrupar", protect, agruparTipologias);

export default router;

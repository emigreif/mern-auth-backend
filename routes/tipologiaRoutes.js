// backend/routes/tipologiaRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import multer from "multer";
import {
  listarTipologias,
  obtenerTipologia,
  crearTipologia,
  actualizarTipologia,
  eliminarTipologia,
  agruparTipologias,
  importarTipologias
} from "../controllers/tipologiaController.js";

const upload = multer(); // Para recibir archivos en memoria

const router = express.Router();

/**
 * /api/tipologias => GET (listar), POST (crear)
 * /api/tipologias/:id => GET, PUT, DELETE
 * /api/tipologias/importar => POST (subir Excel, parsear con xlsx)
 * /api/tipologias/agrupar => POST (agrupar tipologías)
 */

router.get("/", protect, listarTipologias);
router.post("/", protect, crearTipologia);

router.get("/:id", protect, obtenerTipologia);
router.put("/:id", protect, actualizarTipologia);
router.delete("/:id", protect, eliminarTipologia);

router.post("/importar", protect, upload.single("archivoExcel"), importarTipologias);
router.post("/agrupar", protect, agruparTipologias);

export default router;

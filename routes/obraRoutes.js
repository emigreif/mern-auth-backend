// backend/routes/obraRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  listarObras,
  obtenerObra,
  crearObra,
  actualizarObra,
  eliminarObra,
  agregarPerfilesOV,
  agregarVidriosOV,
  agregarAccesoriosOV,
  agregarTipologiasOV,
  eliminarItemOV,
  actualizarPerfilesOV,
  actualizarVidriosOV,
  actualizarAccesoriosOV,
  actualizarTipologiasOV



} from "../controllers/obraController.js";

const router = express.Router();

/**
 * /api/obras => GET (listar), POST (crear)
 * /api/obras/:id => GET, PUT, DELETE
 */

router.route("/")
  .get(protect, listarObras)
  .post(protect, crearObra);

router.route("/:id")
  .get(protect, obtenerObra)
  .put(protect, actualizarObra)
  .delete(protect, eliminarObra);

  router.post("/:id/perfilesOV", protect, agregarPerfilesOV);
  router.post("/:id/vidriosOV", protect, agregarVidriosOV);
  router.post("/:id/accesoriosOV", protect, agregarAccesoriosOV);
  router.post("/:id/tipologiasOV", protect, agregarTipologiasOV);
  router.put("/:id/perfilesOV", protect, actualizarPerfilesOV);
router.put("/:id/vidriosOV", protect, actualizarVidriosOV);
router.put("/:id/accesoriosOV", protect, actualizarAccesoriosOV);
router.put("/:id/tipologiasOV", protect, actualizarTipologiasOV);
  
  // opcional
  router.delete("/:id/:tipo/:itemId", protect, eliminarItemOV);
  
export default router;

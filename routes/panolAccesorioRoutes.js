import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  obtenerAccesorios,
  crearAccesorio,
  actualizarAccesorio,
  eliminarAccesorio
} from "../controllers/panolAccesorioController.js";

const router = express.Router();

router.use(protect);

router.get("/", obtenerAccesorios);
router.post("/", crearAccesorio);
router.put("/:id", actualizarAccesorio);
router.delete("/:id", eliminarAccesorio);

export default router;

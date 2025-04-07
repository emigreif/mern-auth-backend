import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  obtenerPerfiles,
  crearPerfil,
  actualizarPerfil,
  eliminarPerfil
} from "../controllers/panolPerfilController.js";

const router = express.Router();

router.use(protect);

router.get("/", obtenerPerfiles);
router.post("/", crearPerfil);
router.put("/:id", actualizarPerfil);
router.delete("/:id", eliminarPerfil);

export default router;

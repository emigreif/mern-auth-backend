// backend/routes/perfilRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  listarPerfiles,
  crearPerfil,
  loginPerfil,
  editarPerfil,
  eliminarPerfil
} from "../controllers/perfilController.js";

const router = express.Router();

router.get("/", protect, listarPerfiles);     // GET => crea admin si no hay
router.post("/", protect, crearPerfil);       // POST => respeta límite de cantidadUsuarios
router.post("/login", protect, loginPerfil);  // 2do login
router.put("/", protect, editarPerfil);
router.delete("/:id", protect, eliminarPerfil);

export default router;

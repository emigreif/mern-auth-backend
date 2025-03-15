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

/**
 * /api/perfiles => GET (listar, crea admin si no hay),
 *                  POST (crear, respeta límite)
 * /api/perfiles/login => POST (2do login)
 * /api/perfiles => PUT (editar)
 * /api/perfiles/:id => DELETE (eliminar)
 */

router.get("/", protect, listarPerfiles);
router.post("/", protect, crearPerfil);
router.post("/login", protect, loginPerfil);
router.put("/", protect, editarPerfil);
router.delete("/:id", protect, eliminarPerfil);

export default router;

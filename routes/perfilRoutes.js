// backend/routes/perfilRoutes.js
import express from "express";
import {
  crearPerfil,
  editarPerfil,
  eliminarPerfil,
  asignarPerfil
} from "../controllers/perfilController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Crear un nuevo perfil
router.post("/", protect, crearPerfil);

// Editar perfil
// Se asume que el ID del perfil vendrá en el body. 
// Si prefieres un estilo REST, podrías usar PUT "/:id"
router.put("/", protect, editarPerfil);

// Eliminar perfil
router.delete("/:id", protect, eliminarPerfil);

// Asignar perfil a un usuario
router.post("/asignar", protect, asignarPerfil);

export default router;

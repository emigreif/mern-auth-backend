import express from "express";
import { crearPerfil, editarPerfil, eliminarPerfil, asignarPerfil } from "../controllers/perfilController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, crearPerfil);
router.put("/", protect, editarPerfil);
router.delete("/:id", protect, eliminarPerfil);
router.post("/asignar", protect, asignarPerfil);

export default router;

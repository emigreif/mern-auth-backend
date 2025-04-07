import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  obtenerVidrios,
  crearVidrio,
  actualizarVidrio,
  eliminarVidrio
} from "../controllers/panolVidrioController.js";

const router = express.Router();

router.use(protect);

router.get("/", obtenerVidrios);
router.post("/", crearVidrio);
router.put("/:id", actualizarVidrio);
router.delete("/:id", eliminarVidrio);

export default router;

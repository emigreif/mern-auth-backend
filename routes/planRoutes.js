/* // backend/routes/planRoutes.js
import express from "express";
import Plan from "../models/Plan.js";
// Importa tu middleware de auth y admin-check
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Crear Plan (ADMIN)
router.post("/", protect, async (req, res) => {
  try {
    // TODO: Verifica que el user es admin
    const { nombre, descripcion, precioMensual, cantidadUsuarios } = req.body;
    const plan = new Plan({
      nombre,
      descripcion,
      precioMensual,
      cantidadUsuarios
    });
    await plan.save();
    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ message: "Error al crear plan", error: error.message });
  }
});

// Listar planes (visible para que el frontend muestre opciones)
router.get("/", protect, async (req, res) => {
  try {
    const planes = await Plan.find({});
    res.json(planes);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener planes", error: error.message });
  }
});

export default router;
 */
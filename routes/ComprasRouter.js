import express from "express";
import Compra from "../models/Compra.js";
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Obtener todas las compras del usuario
router.get("/", protect, async (req, res) => {
  try {
    const compras = await Compra.find({ user: req.user.id });
    res.json(compras);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener compras", error });
  }
});

// Guardar nuevas compras (asignando user)
router.post("/", protect, async (req, res) => {
  try {
    // Suponiendo que req.body es un array de compras
    const nuevasCompras = req.body.map(compra => ({ ...compra, user: req.user.id }));
    const comprasGuardadas = await Compra.insertMany(nuevasCompras);
    res.status(201).json(comprasGuardadas);
  } catch (error) {
    res.status(500).json({ message: "Error al guardar compras", error });
  }
});

// Actualizar una compra
router.put("/:id", protect, async (req, res) => {
  try {
    const compraActualizada = await Compra.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!compraActualizada) return res.status(404).json({ message: "Compra no encontrada" });
    res.json(compraActualizada);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la compra", error });
  }
});

// Eliminar una compra
router.delete("/:id", protect, async (req, res) => {
  try {
    const compraEliminada = await Compra.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!compraEliminada) return res.status(404).json({ message: "Compra no encontrada" });
    res.json({ message: "Compra eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la compra", error });
  }
});

export default router;

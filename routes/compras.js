import express from "express";
import Compra from "../models/Compra.js"; // Cambia a import

const router = express.Router();

// Obtener todas las compras
router.get("/", async (req, res) => {
  try {
    const compras = await Compra.find();
    res.json(compras);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener compras", error });
  }
});

// Guardar nuevas compras
router.post("/", async (req, res) => {
  try {
    const nuevasCompras = req.body;
    const comprasGuardadas = await Compra.insertMany(nuevasCompras);
    res.status(201).json(comprasGuardadas);
  } catch (error) {
    res.status(500).json({ message: "Error al guardar compras", error });
  }
});

// Actualizar una compra
router.put("/:id", async (req, res) => {
  try {
    const compraActualizada = await Compra.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(compraActualizada);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la compra", error });
  }
});

// Eliminar una compra
router.delete("/:id", async (req, res) => {
  try {
    await Compra.findByIdAndDelete(req.params.id);
    res.json({ message: "Compra eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la compra", error });
  }
});

export default router;

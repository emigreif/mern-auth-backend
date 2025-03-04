import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { CompraAluminio, CompraVidrios, CompraAccesorios } from "../models/Compra.js";

const router = express.Router();

// Función auxiliar para obtener el modelo según el tipo de compra
const getCompraModel = (tipo) => {
  switch (tipo) {
    case "aluminio":
      return CompraAluminio;
    case "vidrios":
      return CompraVidrios;
    case "accesorios":
      return CompraAccesorios;
    default:
      return null;
  }
};

// Obtener todas las compras de un determinado tipo para el usuario autenticado
router.get("/:tipo", protect, async (req, res) => {
  const { tipo } = req.params;
  const Model = getCompraModel(tipo);
  if (!Model)
    return res.status(400).json({ message: "Tipo de compra inválido" });
  try {
    const compras = await Model.find({ user: req.user.id });
    res.json(compras);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener compras", error: error.message });
  }
});

// Guardar nuevas compras del tipo indicado (req.body puede ser un objeto o un array)
router.post("/:tipo", protect, async (req, res) => {
  const { tipo } = req.params;
  const Model = getCompraModel(tipo);
  if (!Model)
    return res.status(400).json({ message: "Tipo de compra inválido" });
  try {
    let nuevasCompras;
    if (Array.isArray(req.body)) {
      nuevasCompras = req.body.map((compra) => ({ ...compra, user: req.user.id }));
      const comprasGuardadas = await Model.insertMany(nuevasCompras);
      return res.status(201).json(comprasGuardadas);
    } else {
      const nuevaCompra = new Model({ ...req.body, user: req.user.id });
      const compraGuardada = await nuevaCompra.save();
      return res.status(201).json(compraGuardada);
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al guardar compras", error: error.message });
  }
});

// Actualizar una compra del tipo indicado
router.put("/:tipo/:id", protect, async (req, res) => {
  const { tipo, id } = req.params;
  const Model = getCompraModel(tipo);
  if (!Model)
    return res.status(400).json({ message: "Tipo de compra inválido" });
  try {
    const compraActualizada = await Model.findOneAndUpdate(
      { _id: id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!compraActualizada)
      return res.status(404).json({ message: "Compra no encontrada" });
    res.json(compraActualizada);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar la compra", error: error.message });
  }
});

// Eliminar una compra del tipo indicado
router.delete("/:tipo/:id", protect, async (req, res) => {
  const { tipo, id } = req.params;
  const Model = getCompraModel(tipo);
  if (!Model)
    return res.status(400).json({ message: "Tipo de compra inválido" });
  try {
    const compraEliminada = await Model.findOneAndDelete({ _id: id, user: req.user.id });
    if (!compraEliminada)
      return res.status(404).json({ message: "Compra no encontrada" });
    res.json({ message: "Compra eliminada correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar la compra", error: error.message });
  }
});

export default router;

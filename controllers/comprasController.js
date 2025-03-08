import { CompraAluminio, CompraVidrios, CompraAccesorios } from "../models/Compra.js";

// 🔹 Función para obtener el modelo según el tipo de compra
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

// 🔹 Listar todas las compras de un tipo
export const listarCompras = async (req, res) => {
  const { tipo } = req.params;
  const Model = getCompraModel(tipo);
  if (!Model) return res.status(400).json({ message: "Tipo de compra inválido" });

  try {
    const compras = await Model.find({ user: req.user.id });
    res.json(compras);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener compras", error: error.message });
  }
};

// 🔹 Crear una nueva compra
export const crearCompra = async (req, res) => {
  const { tipo } = req.params;
  const Model = getCompraModel(tipo);
  if (!Model) return res.status(400).json({ message: "Tipo de compra inválido" });

  try {
    const nuevaCompra = new Model({ ...req.body, user: req.user.id });
    const compraGuardada = await nuevaCompra.save();
    res.status(201).json(compraGuardada);
  } catch (error) {
    res.status(500).json({ message: "Error al crear la compra", error: error.message });
  }
};

// 🔹 Actualizar una compra
export const actualizarCompra = async (req, res) => {
  const { tipo, id } = req.params;
  const Model = getCompraModel(tipo);
  if (!Model) return res.status(400).json({ message: "Tipo de compra inválido" });

  try {
    const compraActualizada = await Model.findOneAndUpdate(
      { _id: id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!compraActualizada) return res.status(404).json({ message: "Compra no encontrada" });
    res.json(compraActualizada);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar compra", error: error.message });
  }
};

// 🔹 Eliminar una compra
export const eliminarCompra = async (req, res) => {
  const { tipo, id } = req.params;
  const Model = getCompraModel(tipo);
  if (!Model) return res.status(400).json({ message: "Tipo de compra inválido" });

  try {
    const compraEliminada = await Model.findOneAndDelete({ _id: id, user: req.user.id });
    if (!compraEliminada) return res.status(404).json({ message: "Compra no encontrada" });
    res.json({ message: "Compra eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar compra", error: error.message });
  }
};

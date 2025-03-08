import { CompraAluminio, CompraVidrios, CompraAccesorios } from "../models/Compra.js";

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

// 📌 Obtener todas las compras de un determinado tipo para el usuario autenticado
export const listarCompras = async (req, res) => {
  const { tipo } = req.params;
  const Model = getCompraModel(tipo);

  if (!Model) return res.status(400).json({ message: "Tipo de compra inválido" });

  try {
    const compras = await Model.find({ user: req.user.id }).populate("proveedor obra");
    res.json(compras);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener compras", error: error.message });
  }
};

// 📌 Obtener una compra por ID
export const obtenerCompra = async (req, res) => {
  const { tipo, id } = req.params;
  const Model = getCompraModel(tipo);

  if (!Model) return res.status(400).json({ message: "Tipo de compra inválido" });

  try {
    const compra = await Model.findOne({ _id: id, user: req.user.id }).populate("proveedor obra");

    if (!compra) return res.status(404).json({ message: "Compra no encontrada" });

    res.json(compra);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la compra", error: error.message });
  }
};

// 📌 Guardar una nueva compra
export const crearCompra = async (req, res) => {
  const { tipo } = req.params;
  const Model = getCompraModel(tipo);

  if (!Model) return res.status(400).json({ message: "Tipo de compra inválido" });

  try {
    let nuevaCompra;

    if (Array.isArray(req.body)) {
      const compras = req.body.map((compra) => ({ ...compra, user: req.user.id }));
      nuevaCompra = await Model.insertMany(compras);
    } else {
      nuevaCompra = new Model({ ...req.body, user: req.user.id });
      await nuevaCompra.save();
    }

    res.status(201).json(nuevaCompra);
  } catch (error) {
    res.status(500).json({ message: "Error al guardar la compra", error: error.message });
  }
};

// 📌 Actualizar una compra por ID
export const actualizarCompra = async (req, res) => {
  const { tipo, id } = req.params;
  const Model = getCompraModel(tipo);

  if (!Model) return res.status(400).json({ message: "Tipo de compra inválido" });

  try {
    const compraActualizada = await Model.findOneAndUpdate(
      { _id: id, user: req.user.id },
      req.body,
      { new: true }
    ).populate("proveedor obra");

    if (!compraActualizada) return res.status(404).json({ message: "Compra no encontrada" });

    res.json(compraActualizada);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la compra", error: error.message });
  }
};

// 📌 Eliminar una compra por ID
export const eliminarCompra = async (req, res) => {
  const { tipo, id } = req.params;
  const Model = getCompraModel(tipo);

  if (!Model) return res.status(400).json({ message: "Tipo de compra inválido" });

  try {
    const compraEliminada = await Model.findOneAndDelete({ _id: id, user: req.user.id });

    if (!compraEliminada) return res.status(404).json({ message: "Compra no encontrada" });

    res.json({ message: "Compra eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la compra", error: error.message });
  }
};
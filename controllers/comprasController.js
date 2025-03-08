import { CompraAluminio, CompraVidrios, CompraAccesorios } from "../models/Compra.js";
import { getAll, getById, create, update, remove } from "./BaseController.js";

// 📌 Función auxiliar para seleccionar modelo según el tipo de compra
const getModel = (tipo) => {
  switch (tipo) {
    case "aluminio": return CompraAluminio;
    case "vidrios": return CompraVidrios;
    case "accesorios": return CompraAccesorios;
    default: return null;
  }
};

// 📌 Obtener todas las compras
export const listarCompras = async (req, res) => {
  const Model = getModel(req.params.tipo);
  if (!Model) return res.status(400).json({ message: "Tipo de compra inválido" });
  return getAll(Model)(req, res);
};

// 📌 Obtener una compra por ID
export const obtenerCompra = async (req, res) => {
  const Model = getModel(req.params.tipo);
  if (!Model) return res.status(400).json({ message: "Tipo de compra inválido" });
  return getById(Model)(req, res);
};

// 📌 Crear una nueva compra
export const crearCompra = async (req, res) => {
  const Model = getModel(req.params.tipo);
  if (!Model) return res.status(400).json({ message: "Tipo de compra inválido" });
  return create(Model)(req, res);
};

// 📌 Actualizar una compra
export const actualizarCompra = async (req, res) => {
  const Model = getModel(req.params.tipo);
  if (!Model) return res.status(400).json({ message: "Tipo de compra inválido" });
  return update(Model)(req, res);
};

// 📌 Eliminar una compra
export const eliminarCompra = async (req, res) => {
  const Model = getModel(req.params.tipo);
  if (!Model) return res.status(400).json({ message: "Tipo de compra inválido" });
  return remove(Model)(req, res);
};

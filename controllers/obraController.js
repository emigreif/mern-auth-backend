// controllers/obraController.js
import Obra from "../models/obra.js";
import { getById, create, update, remove } from "./baseController.js";

/**
 * getAll genérico no hace populate, así que creamos uno custom para listar
 */
export const listarObras = async (req, res) => {
  try {
    const data = await Obra.find({ user: req.user.id }).populate(
      "cliente",
      "nombre apellido"
    );
    res.json(data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener obras", error: error.message });
  }
};

export const obtenerObra = getById(Obra);
export const crearObra = create(Obra);
export const actualizarObra = update(Obra);
export const eliminarObra = remove(Obra);
export const agregarPerfilesOV = async (req, res) => {
  try {
    const { id } = req.params;
    const nuevos = req.body; // Array de objetos

    const obra = await Obra.findOne({ _id: id, user: req.user.id });
    if (!obra) return res.status(404).json({ message: "Obra no encontrada" });

    obra.perfilesOV.push(...nuevos);
    await obra.save();

    res.json({ message: "Perfiles agregados a OV", perfilesOV: obra.perfilesOV });
  } catch (error) {
    res.status(500).json({ message: "Error al agregar perfiles OV", error: error.message });
  }
};
export const agregarVidriosOV = async (req, res) => {
  try {
    const { id } = req.params;
    const nuevos = req.body; // Array de objetos

    const obra = await Obra.findOne({ _id: id, user: req.user.id });
    if (!obra) return res.status(404).json({ message: "Obra no encontrada" });

    obra.vidriosOV.push(...nuevos);
    await obra.save();

    res.json({ message: "Vidrios agregados a OV", vidriosOV: obra.vidriosOV });
  } catch (error) {
    res.status(500).json({ message: "Error al agregar vidrios OV", error: error.message });
  }
};
export const agregarAccesoriosOV = async (req, res) => {
  try {
    const { id } = req.params;
    const nuevos = req.body;

    const obra = await Obra.findOne({ _id: id, user: req.user.id });
    if (!obra) return res.status(404).json({ message: "Obra no encontrada" });

    obra.accesoriosOV.push(...nuevos);
    await obra.save();

    res.json({ message: "Accesorios agregados a OV", accesoriosOV: obra.accesoriosOV });
  } catch (error) {
    res.status(500).json({ message: "Error al agregar accesorios OV", error: error.message });
  }
};
export const agregarTipologiasOV = async (req, res) => {
  try {
    const { id } = req.params;
    const nuevas = req.body;

    const obra = await Obra.findOne({ _id: id, user: req.user.id });
    if (!obra) return res.status(404).json({ message: "Obra no encontrada" });

    obra.tipologiasOV.push(...nuevas);
    await obra.save();

    res.json({ message: "Tipologías agregadas a OV", tipologiasOV: obra.tipologiasOV });
  } catch (error) {
    res.status(500).json({ message: "Error al agregar tipologías OV", error: error.message });
  }
};
export const eliminarItemOV = async (req, res) => {
  try {
    const { id, tipo, itemId } = req.params; // tipo = perfilesOV | vidriosOV | etc.

    const obra = await Obra.findOne({ _id: id, user: req.user.id });
    if (!obra) return res.status(404).json({ message: "Obra no encontrada" });

    if (!["perfilesOV", "vidriosOV", "accesoriosOV", "tipologiasOV"].includes(tipo)) {
      return res.status(400).json({ message: "Tipo de material inválido" });
    }

    obra[tipo] = obra[tipo].filter((item) => item._id.toString() !== itemId);
    await obra.save();

    res.json({ message: `${tipo} actualizado`, [tipo]: obra[tipo] });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar", error: error.message });
  }
};
export const actualizarPerfilesOV = async (req, res) => {
  try {
    const { id } = req.params;
    const nuevos = req.body; // Array completo

    const obra = await Obra.findOne({ _id: id, user: req.user.id });
    if (!obra) return res.status(404).json({ message: "Obra no encontrada" });

    obra.perfilesOV = nuevos;
    await obra.save();

    res.json({ message: "Perfiles OV actualizados", perfilesOV: obra.perfilesOV });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar perfiles OV", error: error.message });
  }
};
export const actualizarVidriosOV = async (req, res) => {
  try {
    const { id } = req.params;
    const nuevos = req.body;

    const obra = await Obra.findOne({ _id: id, user: req.user.id });
    if (!obra) return res.status(404).json({ message: "Obra no encontrada" });

    obra.vidriosOV = nuevos;
    await obra.save();

    res.json({ message: "Vidrios OV actualizados", vidriosOV: obra.vidriosOV });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar vidrios OV", error: error.message });
  }
};
export const actualizarAccesoriosOV = async (req, res) => {
  try {
    const { id } = req.params;
    const nuevos = req.body;

    const obra = await Obra.findOne({ _id: id, user: req.user.id });
    if (!obra) return res.status(404).json({ message: "Obra no encontrada" });

    obra.accesoriosOV = nuevos;
    await obra.save();

    res.json({ message: "Accesorios OV actualizados", accesoriosOV: obra.accesoriosOV });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar accesorios OV", error: error.message });
  }
};
export const actualizarTipologiasOV = async (req, res) => {
  try {
    const { id } = req.params;
    const nuevos = req.body;

    const obra = await Obra.findOne({ _id: id, user: req.user.id });
    if (!obra) return res.status(404).json({ message: "Obra no encontrada" });

    obra.tipologiasOV = nuevos;
    await obra.save();

    res.json({ message: "Tipologías OV actualizadas", tipologiasOV: obra.tipologiasOV });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar tipologías OV", error: error.message });
  }
};

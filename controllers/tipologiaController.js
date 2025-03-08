import Tipologia from "../models/Tipologia.js";
import mongoose from "mongoose";

/**
 * 🔹 Obtener todas las tipologías del usuario autenticado
 */
export const listarTipologias = async (req, res) => {
  try {
    const tipologias = await Tipologia.find({ user: req.user.id });
    res.json(tipologias);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener tipologías", error: error.message });
  }
};

/**
 * 🔹 Obtener una tipología por ID
 */
export const obtenerTipologia = async (req, res) => {
  try {
    const tipologia = await Tipologia.findOne({ _id: req.params.id, user: req.user.id });
    if (!tipologia) return res.status(404).json({ message: "Tipología no encontrada" });
    res.json(tipologia);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener tipología", error: error.message });
  }
};

/**
 * 🔹 Crear una nueva tipología manualmente
 */
export const crearTipologia = async (req, res) => {
  try {
    const { nombre, descripcion, ancho, alto } = req.body;

    if (!nombre || !descripcion || !ancho || !alto) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const nuevaTipologia = new Tipologia({
      nombre,
      descripcion,
      ancho,
      alto,
      user: req.user.id
    });

    const tipologiaGuardada = await nuevaTipologia.save();
    res.status(201).json(tipologiaGuardada);
  } catch (error) {
    res.status(400).json({ message: "Error al crear tipología", error: error.message });
  }
};

/**
 * 🔹 Actualizar una tipología (incluye modificación de medidas)
 */
export const actualizarTipologia = async (req, res) => {
  try {
    const { nombre, descripcion, ancho, alto } = req.body;

    const tipologiaActualizada = await Tipologia.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { nombre, descripcion, ancho, alto },
      { new: true }
    );

    if (!tipologiaActualizada) return res.status(404).json({ message: "Tipología no encontrada" });

    res.json(tipologiaActualizada);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar tipología", error: error.message });
  }
};

/**
 * 🔹 Eliminar una tipología
 */
export const eliminarTipologia = async (req, res) => {
  try {
    const tipologiaEliminada = await Tipologia.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!tipologiaEliminada) return res.status(404).json({ message: "Tipología no encontrada" });

    res.json({ message: "Tipología eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar tipología", error: error.message });
  }
};

/**
 * 🔹 Agrupar varias tipologías en una nueva combinada
 */
export const agruparTipologias = async (req, res) => {
  try {
    const { tipologiaIds, nombre, ancho, alto } = req.body;

    if (!tipologiaIds || !Array.isArray(tipologiaIds) || tipologiaIds.length < 2) {
      return res.status(400).json({ message: "Debes seleccionar al menos dos tipologías para agrupar." });
    }

    if (!nombre) {
      return res.status(400).json({ message: "El nombre de la nueva tipología es obligatorio." });
    }

    // Buscar las tipologías originales
    const tipologias = await Tipologia.find({ _id: { $in: tipologiaIds }, user: req.user.id });

    if (tipologias.length !== tipologiaIds.length) {
      return res.status(404).json({ message: "Algunas tipologías no fueron encontradas." });
    }

    // Crear nueva tipología agrupada
    const nuevaTipologia = new Tipologia({
      nombre,
      descripcion: tipologias.map(t => t.descripcion).join(" + "),
      ancho: ancho || tipologias.reduce((sum, t) => sum + t.ancho, 0), // Si no se especifica, se calcula
      alto: alto || Math.max(...tipologias.map(t => t.alto)), // Si no se especifica, se calcula
      agrupada: true,
      origenes: tipologiaIds,
      user: req.user.id
    });

    const tipologiaGuardada = await nuevaTipologia.save();

    // Eliminar tipologías originales
    await Tipologia.deleteMany({ _id: { $in: tipologiaIds }, user: req.user.id });

    res.status(201).json({
      message: "Tipología agrupada correctamente.",
      tipologia: tipologiaGuardada
    });
  } catch (error) {
    res.status(500).json({ message: "Error al agrupar tipologías", error: error.message });
  }
};

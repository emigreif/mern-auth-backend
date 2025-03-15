// controllers/panolController.js
import Panol from "../models/panol.js";

/**
 * Obtener el estado del pañol (o crearlo si no existe)
 */
export const obtenerPanol = async (req, res) => {
  try {
    let panol = await Panol.findOne({ user: req.user.id });
    if (!panol) {
      panol = new Panol({ user: req.user.id });
      await panol.save();
    }
    res.json(panol);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el pañol", error: error.message });
  }
};

// 📌 Agregar una herramienta
export const agregarHerramienta = async (req, res) => {
  try {
    const { marca, modelo, descripcion, numeroSerie, estado } = req.body;

    if (!marca || !modelo || !descripcion || !numeroSerie) {
      return res.status(400).json({ message: "Campos obligatorios incompletos" });
    }

    let panol = await Panol.findOne({ user: req.user.id });
    if (!panol) {
      panol = new Panol({ user: req.user.id });
    }

    panol.herramientas.push({
      marca,
      modelo,
      descripcion,
      numeroSerie,
      estado
    });

    await panol.save();
    res.status(201).json(panol.herramientas);
  } catch (error) {
    res.status(400).json({ message: "Error al agregar herramienta", error: error.message });
  }
};

// 📌 Eliminar herramienta
export const eliminarHerramienta = async (req, res) => {
  try {
    let panol = await Panol.findOne({ user: req.user.id });
    if (!panol) return res.status(404).json({ message: "Pañol no encontrado" });

    panol.herramientas = panol.herramientas.filter(
      (h) => h._id.toString() !== req.params.id
    );

    await panol.save();
    res.json({ message: "Herramienta eliminada" });
  } catch (error) {
    res.status(400).json({ message: "Error al eliminar herramienta", error: error.message });
  }
};

// 📌 Agregar un perfil
export const agregarPerfil = async (req, res) => {
  try {
    const { codigo, cantidad, descripcion, largo, color } = req.body;

    if (!codigo || cantidad == null || !descripcion || !largo || !color) {
      return res.status(400).json({ message: "Campos obligatorios incompletos" });
    }

    let panol = await Panol.findOne({ user: req.user.id });
    if (!panol) panol = new Panol({ user: req.user.id });

    panol.perfiles.push({
      codigo,
      cantidad,
      descripcion,
      largo,
      color
    });

    await panol.save();
    res.status(201).json(panol.perfiles);
  } catch (error) {
    res.status(400).json({ message: "Error al agregar perfil", error: error.message });
  }
};

// 📌 Eliminar perfil
export const eliminarPerfil = async (req, res) => {
  try {
    let panol = await Panol.findOne({ user: req.user.id });
    if (!panol) return res.status(404).json({ message: "Pañol no encontrado" });

    panol.perfiles = panol.perfiles.filter(
      (p) => p._id.toString() !== req.params.id
    );

    await panol.save();
    res.json({ message: "Perfil eliminado" });
  } catch (error) {
    res.status(400).json({ message: "Error al eliminar perfil", error: error.message });
  }
};

// 📌 Agregar un accesorio
export const agregarAccesorio = async (req, res) => {
  try {
    const { codigo, descripcion, color, cantidad, marca, unidad } = req.body;

    // Ajusta según tu schema
    if (!codigo || !descripcion || !color || cantidad == null) {
      return res.status(400).json({ message: "Campos obligatorios incompletos" });
    }

    let panol = await Panol.findOne({ user: req.user.id });
    if (!panol) panol = new Panol({ user: req.user.id });

    panol.accesorios.push({
      codigo,
      descripcion,
      color,
      cantidad,
      unidad: unidad || "u"
    });

    await panol.save();
    res.status(201).json(panol.accesorios);
  } catch (error) {
    res.status(400).json({ message: "Error al agregar accesorio", error: error.message });
  }
};

// 📌 Eliminar accesorio
export const eliminarAccesorio = async (req, res) => {
  try {
    let panol = await Panol.findOne({ user: req.user.id });
    if (!panol) return res.status(404).json({ message: "Pañol no encontrado" });

    panol.accesorios = panol.accesorios.filter(
      (a) => a._id.toString() !== req.params.id
    );

    await panol.save();
    res.json({ message: "Accesorio eliminado" });
  } catch (error) {
    res.status(400).json({ message: "Error al eliminar accesorio", error: error.message });
  }
};

// 📌 Agregar un vidrio
export const agregarVidrio = async (req, res) => {
  try {
    const { codigo, descripcion, cantidad, ancho, alto, tipo } = req.body;

    if (!codigo || cantidad == null || !descripcion || !ancho || !alto) {
      return res.status(400).json({ message: "Campos obligatorios incompletos" });
    }

    let panol = await Panol.findOne({ user: req.user.id });
    if (!panol) panol = new Panol({ user: req.user.id });

    panol.vidrios.push({
      codigo,
      descripcion,
      cantidad,
      ancho,
      alto,
      tipo: tipo || "simple"
    });

    await panol.save();
    res.status(201).json(panol.vidrios);
  } catch (error) {
    res.status(400).json({ message: "Error al agregar vidrio", error: error.message });
  }
};

// 📌 Eliminar un vidrio
export const eliminarVidrio = async (req, res) => {
  try {
    let panol = await Panol.findOne({ user: req.user.id });
    if (!panol) return res.status(404).json({ message: "Pañol no encontrado" });

    panol.vidrios = panol.vidrios.filter(
      (v) => v._id.toString() !== req.params.id
    );

    await panol.save();
    res.json({ message: "Vidrio eliminado" });
  } catch (error) {
    res.status(400).json({ message: "Error al eliminar vidrio", error: error.message });
  }
};

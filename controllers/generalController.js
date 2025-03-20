import PerfilGeneral from "../models/PerfilGeneral.js";
import VidrioGeneral from "../models/VidrioGeneral.js";

/** ========================
 * 📌 MÉTODOS PARA PERFILES
 * ======================== */

/**
 * Obtener todos los perfiles generales
 */
export const obtenerPerfilesGenerales = async (req, res) => {
  try {
    const perfiles = await PerfilGeneral.find();
    res.json(perfiles);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener perfiles", error: error.message });
  }
};

/**
 * Agregar un perfil general
 */
export const agregarPerfilGeneral = async (req, res) => {
  try {
    const { extrusora, linea, codigo, descripcion, largo, pesoxmetro } = req.body;

    if (!extrusora || !linea || !codigo || !descripcion || !largo || !pesoxmetro) {
      return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    const nuevoPerfil = new PerfilGeneral({ extrusora, linea, codigo, descripcion, largo, pesoxmetro });
    await nuevoPerfil.save();
    
    res.status(201).json(nuevoPerfil);
  } catch (error) {
    res.status(400).json({ message: "Error al agregar perfil", error: error.message });
  }
};

/** ========================
 * 📌 MÉTODOS PARA VIDRIOS
 * ======================== */

/**
 * Obtener todos los vidrios generales
 */
export const obtenerVidriosGenerales = async (req, res) => {
  try {
    const vidrios = await VidrioGeneral.find();
    res.json(vidrios);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener vidrios", error: error.message });
  }
};

/**
 * Agregar un vidrio general
 */
export const agregarVidrioGeneral = async (req, res) => {
  try {
    const { descripcion, espesor } = req.body;

    if (!descripcion || !espesor) {
      return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    const nuevoVidrio = new VidrioGeneral({ descripcion, espesor });
    await nuevoVidrio.save();
    
    res.status(201).json(nuevoVidrio);
  } catch (error) {
    res.status(400).json({ message: "Error al agregar vidrio", error: error.message });
  }
};

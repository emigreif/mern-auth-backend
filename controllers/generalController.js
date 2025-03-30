import PerfilGeneral from "../models/PerfilGeneral.js";
import CamaraGeneral from "../models/camaraGeneral.js";
import VidrioGeneral from "../models/VidrioGeneral.js";
import xlsx from "xlsx";

/**
 * Obtener todos los perfiles
 */
export const obtenerPerfiles = async (req, res) => {
  try {
    const perfiles = await PerfilGeneral.find();
    res.json(perfiles);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener perfiles", error: error.message });
  }
};

/**
 * Agregar un nuevo perfil
 */
export const agregarPerfil = async (req, res) => {
  try {
    const { descripcion, extrusora } = req.body;
    const nuevoPerfil = new PerfilGeneral({ descripcion, extrusora });
    await nuevoPerfil.save();
    res.status(201).json(nuevoPerfil);
  } catch (error) {
    res.status(400).json({ message: "Error al agregar perfil", error: error.message });
  }
};

/**
 * Importar perfiles desde Excel
 */
export const importarPerfiles = async (req, res) => {
  try {
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);
    
    const perfiles = data.map((row) => ({
      descripcion: row["Descripcion"],
      extrusora: row["Extrusora"],
    }));

    await PerfilGeneral.insertMany(perfiles);
    res.json({ message: "Perfiles importados con éxito" });
  } catch (error) {
    res.status(400).json({ message: "Error al importar perfiles", error: error.message });
  }
};

/**
 * Obtener todos los vidrios
 */
export const obtenerVidrios = async (req, res) => {
  try {
    const vidrios = await VidrioGeneral.find();
    res.json(vidrios);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener vidrios", error: error.message });
  }
};

/**
 * Agregar un nuevo vidrio
 */
export const agregarVidrio = async (req, res) => {
  try {
    const { descripcion, espesor } = req.body;
    const nuevoVidrio = new VidrioGeneral({ descripcion, espesor });
    await nuevoVidrio.save();
    res.status(201).json(nuevoVidrio);
  } catch (error) {
    res.status(400).json({ message: "Error al agregar vidrio", error: error.message });
  }
};

/**
 * Importar vidrios desde Excel
 */
export const importarVidrios = async (req, res) => {
  try {
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);
    
    const vidrios = data.map((row) => ({
      descripcion: row["Descripcion"],
      espesor: row["Espesor"],
    }));

    await VidrioGeneral.insertMany(vidrios);
    res.json({ message: "Vidrios importados con éxito" });
  } catch (error) {
    res.status(400).json({ message: "Error al importar vidrios", error: error.message });
  }
};
export const importarCamaras = async (req, res) => {
  try {
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    const camaras = data.map((row) => ({
      descripcion: row["Descripcion"],
      espesor: Number(row["Espesor"]),
    }));

    await CamaraGeneral.insertMany(camaras);
    res.json({ message: "Cámaras importadas con éxito" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error al importar cámaras", error: error.message });
  }
};
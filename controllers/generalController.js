// controllers/generalController.js


import PerfilGeneral from "../models/PerfilGeneral.js";
import VidrioGeneral from "../models/VidrioGeneral.js";
import XLSX from "xlsx";
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

/** =============================
 * 📌 IMPORTAR PERFILES DESDE EXCEL
 * ============================= */
export const importarPerfilesDesdeExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No se ha subido ningún archivo" });
    }

    // Leer el archivo Excel
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0]; // Tomamos la primera hoja
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Convertir cada fila en un objeto de Perfil
    const perfiles = data.map((row) => ({
      extrusora: row["Extrusora"],
      linea: row["Linea"],
      codigo: row["Codigo"],
      descripcion: row["Descripcion"],
      largo: row["Largo"],
      pesoxmetro: row["Peso por Metro"]
    }));

    // Insertar en la base de datos
    await PerfilGeneral.insertMany(perfiles);
    
    res.status(201).json({ message: "Perfiles importados correctamente", perfiles });
  } catch (error) {
    res.status(500).json({ message: "Error al importar perfiles", error: error.message });
  }
};

/** =============================
 * 📌 IMPORTAR VIDRIOS DESDE EXCEL
 * ============================= */
export const importarVidriosDesdeExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No se ha subido ningún archivo" });
    }

    // Leer el archivo Excel
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Convertir cada fila en un objeto de Vidrio
    const vidrios = data.map((row) => ({
      descripcion: row["Descripcion"],
      espesor: row["Espesor"],
      peso_m2: row["Espesor"] * 2.5
    }));

    // Insertar en la base de datos
    await VidrioGeneral.insertMany(vidrios);
    
    res.status(201).json({ message: "Vidrios importados correctamente", vidrios });
  } catch (error) {
    res.status(500).json({ message: "Error al importar vidrios", error: error.message });
  }
};
// backend/controllers/tipologiaController.js
import Tipologia from "../models/Tipologia.js";
import { getAll, getById, create, update, remove } from "./BaseController.js";
import xlsx from "xlsx"; // Ejemplo para importar desde Excel (npm i xlsx)

// 1. CRUD básico
export const listarTipologias = getAll(Tipologia);
export const obtenerTipologia = getById(Tipologia);
export const crearTipologia = create(Tipologia);
export const actualizarTipologia = update(Tipologia);
export const eliminarTipologia = remove(Tipologia);

// 2. Importar desde Excel
export const importarTipologias = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No se subió ningún archivo" });
    }
    // req.file.buffer => Buffer del archivo subido (ej. con multer)
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(sheet);

    // Se asume que cada fila tiene { nombre, descripcion, ancho, alto, cantidad, etc. }
    const tipologiasToInsert = rows.map((row) => ({
      nombre: row.nombre || "SIN_NOMBRE",
      descripcion: row.descripcion || "SIN_DESC",
      ancho: Number(row.ancho) || 0,
      alto: Number(row.alto) || 0,
      cantidad: Number(row.cantidad) || 1,
      user: req.user.id
    }));

    const inserted = await Tipologia.insertMany(tipologiasToInsert);
    res.json({ message: "Tipologías importadas", inserted });
  } catch (error) {
    res.status(500).json({ message: "Error al importar tipologías", error: error.message });
  }
};

// 3. Agrupar tipologías
export const agruparTipologias = async (req, res) => {
  try {
    const { tipologiaIds, codigo, nombre, ancho, alto, cantidad } = req.body;
    if (!tipologiaIds || !Array.isArray(tipologiaIds) || tipologiaIds.length < 2) {
      return res.status(400).json({ message: "Debes seleccionar al menos dos tipologías para agrupar." });
    }

    // Buscar tipologías originales
    const originales = await Tipologia.find({ 
      _id: { $in: tipologiaIds },
      user: req.user.id
    });

    if (originales.length !== tipologiaIds.length) {
      return res.status(404).json({ message: "Algunas tipologías no fueron encontradas." });
    }

    // Crear nueva tipología agrupada
    const nueva = new Tipologia({
      codigo,
      nombre,
      descripcion: originales.map(t => t.descripcion).join(" + "),
      ancho: ancho || 0,
      alto: alto || 0,
      cantidad: cantidad || 1,
      agrupada: true,
      origenes: tipologiaIds,
      user: req.user.id
    });
    await nueva.save();

    // Eliminar o marcar tipologías originales (opcional)
    // Ejemplo: borrarlas
    await Tipologia.deleteMany({ _id: { $in: tipologiaIds }, user: req.user.id });

    res.status(201).json({ message: "Tipología agrupada correctamente", nueva });
  } catch (error) {
    res.status(500).json({ message: "Error al agrupar tipologías", error: error.message });
  }
};

import Tipologia from "../models/Tipologia.js";
import multer from "multer";
import xlsx from "xlsx";

// Configurar `multer` para manejar la subida de archivos
const upload = multer({ dest: "uploads/" });

// 🔹 Obtener todas las tipologías
export const listarTipologias = async (req, res) => {
  try {
    const tipologias = await Tipologia.find({ user: req.user.id });
    res.json(tipologias);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener tipologías", error: error.message });
  }
};

// 🔹 Crear una nueva tipología manualmente
export const crearTipologia = async (req, res) => {
  try {
    const { nombre, descripcion, ancho, alto } = req.body;

    if (!nombre || !ancho || !alto) {
      return res.status(400).json({ message: "Nombre, ancho y alto son obligatorios" });
    }

    if (isNaN(ancho) || isNaN(alto) || ancho <= 0 || alto <= 0) {
      return res.status(400).json({ message: "Ancho y alto deben ser números positivos" });
    }

    const nuevaTipologia = new Tipologia({
      nombre,
      descripcion,
      ancho,
      alto,
      user: req.user.id,
    });

    const tipologiaGuardada = await nuevaTipologia.save();
    res.status(201).json(tipologiaGuardada);
  } catch (error) {
    res.status(400).json({ message: "Error al crear tipología", error: error.message });
  }
};

// 🔹 Importar tipologías desde Excel
export const importarTipologias = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Debe subir un archivo Excel" });
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (!data || data.length === 0) {
      return res.status(400).json({ message: "El archivo está vacío o tiene datos inválidos" });
    }

    const tipologiasCreadas = [];

    for (let row of data) {
      if (!row.Nombre || !row.Ancho || !row.Alto) continue; // Si faltan datos esenciales, ignorar fila

      const ancho = parseFloat(row.Ancho);
      const alto = parseFloat(row.Alto);

      if (isNaN(ancho) || isNaN(alto) || ancho <= 0 || alto <= 0) {
        continue; // Ignorar filas con valores inválidos
      }

      const nuevaTipologia = new Tipologia({
        nombre: row.Nombre,
        descripcion: row.Descripcion || "",
        ancho,
        alto,
        user: req.user.id,
      });

      const tipologiaGuardada = await nuevaTipologia.save();
      tipologiasCreadas.push(tipologiaGuardada);
    }

    res.status(201).json({
      message: `Se importaron ${tipologiasCreadas.length} tipologías correctamente`,
      tipologias: tipologiasCreadas,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al importar tipologías", error: error.message });
  }
};

// 🔹 Obtener una tipología por ID
export const obtenerTipologia = async (req, res) => {
  try {
    const tipologia = await Tipologia.findOne({ _id: req.params.id, user: req.user.id });
    if (!tipologia) return res.status(404).json({ message: "Tipología no encontrada" });
    res.json(tipologia);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener tipología", error: error.message });
  }
};

// 🔹 Actualizar una tipología
export const actualizarTipologia = async (req, res) => {
  try {
    const { nombre, ancho, alto } = req.body;

    if (!nombre || !ancho || !alto) {
      return res.status(400).json({ message: "Nombre, ancho y alto son obligatorios" });
    }

    if (isNaN(ancho) || isNaN(alto) || ancho <= 0 || alto <= 0) {
      return res.status(400).json({ message: "Ancho y alto deben ser números positivos" });
    }

    const tipologiaActualizada = await Tipologia.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!tipologiaActualizada) return res.status(404).json({ message: "Tipología no encontrada" });

    res.json(tipologiaActualizada);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar tipología", error: error.message });
  }
};

// 🔹 Eliminar una tipología
export const eliminarTipologia = async (req, res) => {
  try {
    const tipologiaEliminada = await Tipologia.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!tipologiaEliminada) return res.status(404).json({ message: "Tipología no encontrada" });

    res.json({ message: "Tipología eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar tipología", error: error.message });
  }
};

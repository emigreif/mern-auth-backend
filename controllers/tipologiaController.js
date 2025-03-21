import Tipologia from "../models/tipologia.js";
import xlsx from "xlsx";

/** ===========================
 * 📌 OBTENER TODAS LAS TIPOLOGÍAS
 * =========================== */
export const obtenerTipologias = async (req, res) => {
  try {
    const tipologias = await Tipologia.find();
    res.json(tipologias);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener tipologías", error: error.message });
  }
};

/** ===========================
 * 📌 CREAR UNA NUEVA TIPOLOGÍA
 * =========================== */
export const crearTipologia = async (req, res) => {
  try {
    const { codigo, descripcion, categoria } = req.body;

    if (!codigo || !descripcion) {
      return res.status(400).json({ message: "Código y descripción son obligatorios" });
    }

    const nuevaTipologia = new Tipologia({ codigo, descripcion, categoria });
    await nuevaTipologia.save();

    res.status(201).json(nuevaTipologia);
  } catch (error) {
    res.status(400).json({ message: "Error al crear tipología", error: error.message });
  }
};

/** ===========================
 * 📌 ACTUALIZAR TIPOGRAFÍA POR ID
 * =========================== */
export const actualizarTipologia = async (req, res) => {
  try {
    const { id } = req.params;
    const cambios = req.body;

    const tipologiaActualizada = await Tipologia.findByIdAndUpdate(id, cambios, { new: true });

    if (!tipologiaActualizada) {
      return res.status(404).json({ message: "Tipología no encontrada" });
    }

    res.json(tipologiaActualizada);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar tipología", error: error.message });
  }
};

/** ===========================
 * 📌 ELIMINAR TIPOGRAFÍA POR ID
 * =========================== */
export const eliminarTipologia = async (req, res) => {
  try {
    const { id } = req.params;

    const tipologiaEliminada = await Tipologia.findByIdAndDelete(id);
    if (!tipologiaEliminada) {
      return res.status(404).json({ message: "Tipología no encontrada" });
    }

    res.json({ message: "Tipología eliminada correctamente" });
  } catch (error) {
    res.status(400).json({ message: "Error al eliminar tipología", error: error.message });
  }
};

/** ===========================
 * 📌 IMPORTAR TIPOGRAFÍAS DESDE EXCEL
 * =========================== */
export const importarTipologiasDesdeExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No se ha subido ningún archivo" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    let nuevasTipologias = [];

    for (const row of data) {
      if (!row.Codigo || !row.Descripcion) continue; // Evitar filas sin datos esenciales

      const existe = await Tipologia.findOne({ codigo: row.Codigo });
      if (!existe) {
        nuevasTipologias.push({
          codigo: row.Codigo,
          descripcion: row.Descripcion,
          categoria: row.Categoria || "General"
        });
      }
    }

    await Tipologia.insertMany(nuevasTipologias);
    res.status(201).json({ message: "Tipologías importadas correctamente", nuevas: nuevasTipologias.length });
  } catch (error) {
    res.status(400).json({ message: "Error al importar tipologías", error: error.message });
  }
};

/** ===========================
 * 📌 AGRUPAR TIPOGRAFÍAS
 * =========================== */
export const agruparTipologias = async (req, res) => {
  try {
    const { idPrincipal, idsAgrupadas } = req.body;

    const principal = await Tipologia.findById(idPrincipal);
    if (!principal) return res.status(404).json({ message: "Tipología principal no encontrada" });

    await Tipologia.deleteMany({ _id: { $in: idsAgrupadas } });

    res.json({ message: "Tipologías agrupadas correctamente" });
  } catch (error) {
    res.status(400).json({ message: "Error al agrupar tipologías", error: error.message });
  }
};

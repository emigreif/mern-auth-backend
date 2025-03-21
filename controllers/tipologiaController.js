import Tipologia from "../models/tipologia.js";
import excelJS from "exceljs";

/**
 * ✅ Obtener todas las tipologías
 */
export const obtenerTipologias = async (req, res) => {
  try {
    const tipologias = await Tipologia.find();
    res.json(tipologias);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las tipologías", error: error.message });
  }
};

/**
 * ✅ Obtener una tipología por ID
 */
export const obtenerTipologiaPorId = async (req, res) => {
  try {
    const tipologia = await Tipologia.findById(req.params.id);
    if (!tipologia) return res.status(404).json({ message: "Tipología no encontrada" });
    res.json(tipologia);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la tipología", error: error.message });
  }
};

/**
 * ✅ Crear una nueva tipología
 */
export const crearTipologia = async (req, res) => {
  try {
    const { nombre, descripcion, categoria } = req.body;
    const nuevaTipologia = new Tipologia({ nombre, descripcion, categoria });
    await nuevaTipologia.save();
    res.status(201).json(nuevaTipologia);
  } catch (error) {
    res.status(400).json({ message: "Error al crear tipología", error: error.message });
  }
};

/**
 * ✅ Actualizar una tipología existente
 */
export const actualizarTipologia = async (req, res) => {
  try {
    const tipologia = await Tipologia.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!tipologia) return res.status(404).json({ message: "Tipología no encontrada" });
    res.json(tipologia);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la tipología", error: error.message });
  }
};

/**
 * ✅ Eliminar una tipología
 */
export const eliminarTipologia = async (req, res) => {
  try {
    const tipologia = await Tipologia.findByIdAndDelete(req.params.id);
    if (!tipologia) return res.status(404).json({ message: "Tipología no encontrada" });
    res.json({ message: "Tipología eliminada" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la tipología", error: error.message });
  }
};

/**
 * ✅ Importar tipologías desde un archivo Excel
 */
export const importarTipologiasDesdeExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Debe subir un archivo Excel" });
    }

    const workbook = new excelJS.Workbook();
    await workbook.xlsx.readFile(req.file.path);
    const worksheet = workbook.worksheets[0];

    const tipologiasImportadas = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        const nombre = row.getCell(1).value;
        const descripcion = row.getCell(2).value;
        const categoria = row.getCell(3).value;

        if (nombre && descripcion && categoria) {
          tipologiasImportadas.push({ nombre, descripcion, categoria });
        }
      }
    });

    await Tipologia.insertMany(tipologiasImportadas);
    res.status(201).json({ message: "Tipologías importadas correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al importar tipologías", error: error.message });
  }
};

/**
 * ✅ Agrupar varias tipologías en una sola
 */
export const agruparTipologias = async (req, res) => {
  try {
    const { ids, nuevoNombre, nuevaDescripcion, nuevaCategoria } = req.body;

    const tipologiasAEliminar = await Tipologia.find({ _id: { $in: ids } });
    if (tipologiasAEliminar.length === 0) {
      return res.status(404).json({ message: "No se encontraron tipologías para agrupar" });
    }

    const nuevaTipologia = new Tipologia({
      nombre: nuevoNombre,
      descripcion: nuevaDescripcion,
      categoria: nuevaCategoria,
    });

    await nuevaTipologia.save();
    await Tipologia.deleteMany({ _id: { $in: ids } });

    res.status(201).json({ message: "Tipologías agrupadas con éxito", nuevaTipologia });
  } catch (error) {
    res.status(500).json({ message: "Error al agrupar tipologías", error: error.message });
  }
};

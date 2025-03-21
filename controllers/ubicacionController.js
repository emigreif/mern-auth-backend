import Ubicacion from "../models/ubicacion.js";
import excelJS from "exceljs";

/**
 * ✅ Obtener todas las ubicaciones
 */
export const obtenerUbicaciones = async (req, res) => {
  try {
    const ubicaciones = await Ubicacion.find();
    res.json(ubicaciones);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las ubicaciones", error: error.message });
  }
};

/**
 * ✅ Obtener una ubicación por ID
 */
export const obtenerUbicacionPorId = async (req, res) => {
  try {
    const ubicacion = await Ubicacion.findById(req.params.id);
    if (!ubicacion) return res.status(404).json({ message: "Ubicación no encontrada" });
    res.json(ubicacion);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la ubicación", error: error.message });
  }
};

/**
 * ✅ Crear una nueva ubicación
 */
export const crearUbicacion = async (req, res) => {
  try {
    const { nombre, descripcion, zona } = req.body;
    const nuevaUbicacion = new Ubicacion({ nombre, descripcion, zona });
    await nuevaUbicacion.save();
    res.status(201).json(nuevaUbicacion);
  } catch (error) {
    res.status(400).json({ message: "Error al crear ubicación", error: error.message });
  }
};

/**
 * ✅ Actualizar una ubicación existente
 */
export const actualizarUbicacion = async (req, res) => {
  try {
    const ubicacion = await Ubicacion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ubicacion) return res.status(404).json({ message: "Ubicación no encontrada" });
    res.json(ubicacion);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la ubicación", error: error.message });
  }
};

/**
 * ✅ Eliminar una ubicación
 */
export const eliminarUbicacion = async (req, res) => {
  try {
    const ubicacion = await Ubicacion.findByIdAndDelete(req.params.id);
    if (!ubicacion) return res.status(404).json({ message: "Ubicación no encontrada" });
    res.json({ message: "Ubicación eliminada" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la ubicación", error: error.message });
  }
};

/**
 * ✅ Importar ubicaciones desde un archivo Excel
 */
export const importarUbicacionesDesdeExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Debe subir un archivo Excel" });
    }

    const workbook = new excelJS.Workbook();
    await workbook.xlsx.readFile(req.file.path);
    const worksheet = workbook.worksheets[0];

    const ubicacionesImportadas = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        const nombre = row.getCell(1).value;
        const descripcion = row.getCell(2).value;
        const zona = row.getCell(3).value;

        if (nombre && descripcion && zona) {
          ubicacionesImportadas.push({ nombre, descripcion, zona });
        }
      }
    });

    await Ubicacion.insertMany(ubicacionesImportadas);
    res.status(201).json({ message: "Ubicaciones importadas correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al importar ubicaciones", error: error.message });
  }
};

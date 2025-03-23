import Tipologia from "../models/tipologia.js";
import XLSX from "xlsx";

/**
 * Obtener todas las tipologías del usuario
 */
export const obtenerTipologias = async (req, res) => {
  try {
    const tipologias = await Tipologia.find({ user: req.user.id }).populate("obra");
    res.json(tipologias);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener tipologías", error: error.message });
  }
};

/**
 * Crear una nueva tipología
 */
export const crearTipologia = async (req, res) => {
  try {
    const { codigo, descripcion, base, altura, cantidad, obra } = req.body;

    if (!descripcion || !base || !altura || !obra) {
      return res.status(400).json({ message: "Faltan campos requeridos." });
    }

    const nueva = new Tipologia({
      codigo,
      descripcion,
      base,
      altura,
      cantidad: cantidad || 1,
      obra,
      user: req.user.id
    });

    await nueva.save();
    res.status(201).json(nueva);
  } catch (error) {
    res.status(400).json({ message: "Error al crear tipología", error: error.message });
  }
};

/**
 * Actualizar tipología existente
 */
export const actualizarTipologia = async (req, res) => {
  try {
    const tipologia = await Tipologia.findById(req.params.id);
    if (!tipologia) return res.status(404).json({ message: "Tipología no encontrada" });

    if (tipologia.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "No autorizado" });
    }

    Object.assign(tipologia, req.body);
    await tipologia.save();

    res.json(tipologia);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar tipología", error: error.message });
  }
};

/**
 * Eliminar tipología
 */
export const eliminarTipologia = async (req, res) => {
  try {
    const tipologia = await Tipologia.findById(req.params.id);
    if (!tipologia) return res.status(404).json({ message: "Tipología no encontrada" });

    if (tipologia.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "No autorizado" });
    }

    await tipologia.deleteOne();
    res.json({ message: "Tipología eliminada" });
  } catch (error) {
    res.status(400).json({ message: "Error al eliminar tipología", error: error.message });
  }
};

/**
 * Importar tipologías desde un archivo Excel
 */
export const importarTipologiasDesdeExcel = async (req, res) => {
  try {
    const { obra } = req.body;

    if (!req.file) return res.status(400).json({ message: "Archivo no proporcionado" });
    if (!obra) return res.status(400).json({ message: "Debe seleccionar una obra" });

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const hoja = workbook.Sheets[workbook.SheetNames[0]];
    const datos = XLSX.utils.sheet_to_json(hoja);

    const tipologias = datos.map((fila) => ({
      codigo: fila["Tipo"] || "",
      descripcion: fila["Descripción"] || "",
      base: parseFloat(fila["base"]) || 0,
      altura: parseFloat(fila["altura"]) || 0,
      cantidad: parseInt(fila["Cant"]) || 1,
      obra,
      user: req.user.id
    }));

    const creadas = await Tipologia.insertMany(tipologias);
    res.status(201).json({ message: `Se importaron ${creadas.length} tipologías`, creadas });
  } catch (error) {
    res.status(500).json({ message: "Error al importar tipologías", error: error.message });
  }
};

/**
 * Agrupar múltiples tipologías en una sola
 */
export const agruparTipologias = async (req, res) => {
  try {
    const { ids, nuevaDescripcion, obra } = req.body;

    if (!ids || ids.length < 2 || !nuevaDescripcion || !obra) {
      return res.status(400).json({ message: "Faltan datos para agrupar" });
    }

    const originales = await Tipologia.find({ _id: { $in: ids }, user: req.user.id });

    if (originales.length !== ids.length) {
      return res.status(404).json({ message: "Algunas tipologías no se encontraron" });
    }

    const agrupada = new Tipologia({
      codigo: "AGR-" + Date.now(),
      descripcion: nuevaDescripcion,
      base: Math.max(...originales.map((t) => t.base)),
      altura: Math.max(...originales.map((t) => t.altura)),
      cantidad: originales.reduce((acc, t) => acc + (t.cantidad || 1), 0),
      agrupada: true,
      origenes: ids,
      obra,
      user: req.user.id
    });

    await agrupada.save();
    res.status(201).json({ message: "Tipologías agrupadas", agrupada });
  } catch (error) {
    res.status(500).json({ message: "Error al agrupar tipologías", error: error.message });
  }
};

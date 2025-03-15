// controllers/medicionController.js
import Medicion from "../models/medicion.js";
import { getAll, getById, create, update, remove } from "./baseController.js";

/**
 * CRUD básico
 */
export const listarMediciones = getAll(Medicion);
export const obtenerMedicion = getById(Medicion);
export const crearMedicion = create(Medicion);
export const actualizarMedicion = update(Medicion);
export const eliminarMedicion = remove(Medicion);

/**
 * Crear mediciones en lote
 * body: { mediciones: [{ ubicacion, anchoRelevado, altoRelevado, ...}, ...] }
 */
export const crearMedicionesMasivas = async (req, res) => {
  try {
    const { mediciones } = req.body;
    if (!Array.isArray(mediciones) || mediciones.length === 0) {
      return res.status(400).json({ message: "No hay mediciones para crear" });
    }

    const toInsert = mediciones.map((m) => ({ ...m, user: req.user.id }));
    const result = await Medicion.insertMany(toInsert);

    res.status(201).json({ message: "Mediciones creadas", result });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear mediciones masivas", error: error.message });
  }
};

/**
 * Reporte: Por obra, agrupar por piso/ubicación
 */
export const reporteMedicionesPorObra = async (req, res) => {
  try {
    const { obraId } = req.params;
    const mediciones = await Medicion.find({ user: req.user.id }).populate({
      path: "ubicacion",
      match: { obra: obraId },
      populate: {
        path: "tipologias",
        select: "nombre descripcion"
      }
    });

    // Filtrar las que su ubicación sea de la obra
    const filtradas = mediciones.filter((m) => m.ubicacion !== null);
    res.json({ obraId, mediciones: filtradas });
  } catch (error) {
    res.status(500).json({ message: "Error al generar reporte", error: error.message });
  }
};

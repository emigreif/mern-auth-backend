// backend/controllers/ubicacionController.js
import Ubicacion from "../models/Ubicacion.js";
import { getAll, getById, create, update, remove } from "./baseController.js";

// 1. CRUD básico
export const listarUbicaciones = getAll(Ubicacion);
export const obtenerUbicacion = getById(Ubicacion);
export const crearUbicacion = create(Ubicacion);
export const actualizarUbicacion = update(Ubicacion);
export const eliminarUbicacion = remove(Ubicacion);

// 2. Generar en masa
/**
 * Se espera un body con algo como:
 * {
 *   obraId: "...",
 *   pisos: [
 *     { piso: "p1", cantidad: 5 },
 *     { piso: "p2", cantidad: 3 }
 *   ]
 * }
 */
export const generarUbicaciones = async (req, res) => {
  try {
    const { obraId, pisos } = req.body;
    if (!obraId || !Array.isArray(pisos) || pisos.length === 0) {
      return res.status(400).json({ message: "Faltan datos para generar ubicaciones." });
    }

    let creadas = [];
    for (const p of pisos) {
      const { piso, cantidad } = p;
      for (let i = 1; i <= cantidad; i++) {
        creadas.push({
          obra: obraId,
          piso: piso,
          identificador: `${piso}u${i}`,
          user: req.user.id
        });
      }
    }

    const result = await Ubicacion.insertMany(creadas);
    res.json({ message: "Ubicaciones generadas", ubicaciones: result });
  } catch (error) {
    res.status(500).json({ message: "Error al generar ubicaciones", error: error.message });
  }
};

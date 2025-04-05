import Ubicacion from "../models/ubicacion.js";
import { handleMongooseError } from "../utils/validationHelpers.js";

/**
 * 🔍 Obtener todas las ubicaciones del usuario
 */
export const obtenerUbicaciones = async (req, res) => {
  try {
    const ubicaciones = await Ubicacion.find({ user: req.user.id }).populate("obra");
    res.json(ubicaciones);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

/**
 * 🔍 Obtener una ubicación por ID
 */
export const obtenerUbicacionPorId = async (req, res) => {
  try {
    const ubicacion = await Ubicacion.findById(req.params.id);
    if (!ubicacion) return res.status(404).json({ message: "Ubicación no encontrada" });
    res.json(ubicacion);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

/**
 * ➕ Crear nueva ubicación manual
 */
export const crearUbicacion = async (req, res) => {
  try {
    const { piso, ubicacion, obra } = req.body;

    if (!piso || !ubicacion || !obra) {
      return res.status(400).json({ message: "Todos los campos son requeridos" });
    }

    const nuevaUbicacion = new Ubicacion({
      piso,
      ubicacion,
      obra,
      user: req.user.id
    });

    await nuevaUbicacion.save();
    res.status(201).json(nuevaUbicacion);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

/**
 * 📝 Actualizar ubicación por ID
 */
export const actualizarUbicacion = async (req, res) => {
  try {
    const ubicacion = await Ubicacion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ubicacion) return res.status(404).json({ message: "Ubicación no encontrada" });
    res.json(ubicacion);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

/**
 * 🗑️ Eliminar ubicación por ID
 */
export const eliminarUbicacion = async (req, res) => {
  try {
    const ubicacion = await Ubicacion.findByIdAndDelete(req.params.id);
    if (!ubicacion) return res.status(404).json({ message: "Ubicación no encontrada" });
    res.json({ message: "Ubicación eliminada" });
  } catch (error) {
    handleMongooseError(res, error);
  }
};

/**
 * 🗑️ Eliminar todas las ubicaciones de un piso
 */
export const eliminarUbicacionesPorPiso = async (req, res) => {
  try {
    const { piso, obraId } = req.body;
    await Ubicacion.deleteMany({ piso, obra: obraId });
    res.json({ message: `Ubicaciones del piso ${piso} eliminadas` });
  } catch (error) {
    handleMongooseError(res, error);
  }
};

/**
 * 🧩 Editar ubicaciones por piso (borra y crea nuevas)
 */
export const editarUbicacionesPorPiso = async (req, res) => {
  try {
    const { piso, obraId, cantidad } = req.body;

    if (!piso || !obraId || !cantidad || cantidad < 1) {
      return res.status(400).json({ message: "Datos inválidos" });
    }

    await Ubicacion.deleteMany({ piso, obra: obraId });

    const nuevasUbicaciones = [];
    for (let i = 1; i <= cantidad; i++) {
      nuevasUbicaciones.push({
        piso,
        ubicacion: `${piso}U${i}`,
        obra: obraId,
        user: req.user.id
      });
    }

    await Ubicacion.insertMany(nuevasUbicaciones);
    res.json({ message: `Piso ${piso} actualizado`, total: cantidad });
  } catch (error) {
    handleMongooseError(res, error);
  }
};

/**
 * 🏗️ Generar ubicaciones en lote a partir de rangos de pisos
 */
export const generarUbicaciones = async (req, res) => {
  try {
    const { obraId, pisos } = req.body;

    if (!obraId || !Array.isArray(pisos) || pisos.length === 0) {
      return res.status(400).json({ message: "Datos insuficientes" });
    }

    const ubicacionesAGuardar = [];

    for (let pisoItem of pisos) {
      const rango = pisoItem.rango.trim(); // ej: "1-3,5"
      const cantUbicaciones = parseInt(pisoItem.ubicaciones);

      const pisosExpandidos = expandirRangos(rango);

      for (let piso of pisosExpandidos) {
        for (let i = 1; i <= cantUbicaciones; i++) {
          ubicacionesAGuardar.push({
            piso: `P${piso}`,
            ubicacion: `U${i}`,
            obra: obraId,
            user: req.user.id
          });
        }
      }
    }

    await Ubicacion.insertMany(ubicacionesAGuardar);

    res.status(201).json({ message: "Ubicaciones generadas", total: ubicacionesAGuardar.length });
  } catch (error) {
    handleMongooseError(res, error);
  }
};

/**
 * 🔧 Expande rangos tipo "1-3,5" en [1,2,3,5]
 */
function expandirRangos(rangoStr) {
  const partes = rangoStr.split(",");
  const resultado = [];

  for (let parte of partes) {
    if (parte.includes("-")) {
      const [inicio, fin] = parte.split("-").map(Number);
      for (let i = inicio; i <= fin; i++) resultado.push(i);
    } else {
      resultado.push(Number(parte));
    }
  }

  return resultado;
}

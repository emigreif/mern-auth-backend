// controllers/ubicacionController.js
import Ubicacion from "../models/ubicacion.js";

/**
 * 🔹 Obtener todas las ubicaciones del usuario
 */
export const obtenerUbicaciones = async (req, res) => {
  try {
    const ubicaciones = await Ubicacion.find({ user: req.user.id }).populate("obra");
    res.json(ubicaciones);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las ubicaciones", error: error.message });
  }
};

/**
 * 🔹 Obtener una ubicación por ID
 */
export const obtenerUbicacionPorId = async (req, res) => {
  try {
    const ubicacion = await Ubicacion.findOne({ _id: req.params.id, user: req.user.id });
    if (!ubicacion) return res.status(404).json({ message: "Ubicación no encontrada" });
    res.json(ubicacion);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la ubicación", error: error.message });
  }
};

/**
 * 🔹 Crear una sola ubicación manualmente
 */
export const crearUbicacion = async (req, res) => {
  try {
    const { piso, ubicacion, obra } = req.body;

    if (!piso || !ubicacion || !obra) {
      return res.status(400).json({ message: "Campos requeridos: piso, ubicacion, obra" });
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
    res.status(400).json({ message: "Error al crear ubicación", error: error.message });
  }
};

/**
 * 🔹 Actualizar una ubicación existente
 */
export const actualizarUbicacion = async (req, res) => {
  try {
    const actualizada = await Ubicacion.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!actualizada) return res.status(404).json({ message: "Ubicación no encontrada" });
    res.json(actualizada);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la ubicación", error: error.message });
  }
};

/**
 * 🔹 Eliminar una ubicación
 */
export const eliminarUbicacion = async (req, res) => {
  try {
    const eliminada = await Ubicacion.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!eliminada) return res.status(404).json({ message: "Ubicación no encontrada" });
    res.json({ message: "Ubicación eliminada" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la ubicación", error: error.message });
  }
};

/**
 * 🔹 Generar múltiples ubicaciones por piso y cantidad
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
            user: req.user.id,
          });
        }
      }
    }

    await Ubicacion.insertMany(ubicacionesAGuardar);

    res.status(201).json({ message: "Ubicaciones generadas", total: ubicacionesAGuardar.length });
  } catch (error) {
    res.status(500).json({ message: "Error al generar ubicaciones", error: error.message });
  }
};

// Función para convertir "1-3,5,7-9" => [1,2,3,5,7,8,9]
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


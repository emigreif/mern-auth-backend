import Ubicacion from "../models/Ubicacion.js";

/**
 * 📌 Asociar medidas a un vano dentro de una ubicación
 */
export const asociarMedidasAVanos = async (req, res) => {
  try {
    const { ubicacionId, vanoId, medidas } = req.body;

    if (!ubicacionId || !vanoId || !medidas || !Array.isArray(medidas)) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    // Buscar la ubicación asegurando que pertenece al usuario autenticado
    const ubicacion = await Ubicacion.findOne({ _id: ubicacionId, user: req.user.id });

    if (!ubicacion) {
      return res.status(404).json({ message: "Ubicación no encontrada o no pertenece al usuario." });
    }

    // Encontrar el vano específico dentro de la ubicación
    const vano = ubicacion.vanos.find(v => v._id.toString() === vanoId);
    if (!vano) {
      return res.status(404).json({ message: "Vano no encontrado en esta ubicación." });
    }

    // Asignar las medidas al vano
    vano.medidas = medidas;
    await ubicacion.save();

    res.json({ message: "Medidas asociadas correctamente.", ubicacion });
  } catch (error) {
    res.status(500).json({ message: "Error al asociar medidas", error: error.message });
  }
};

/**
 * 📌 Obtener todas las asignaciones del usuario autenticado
 */
export const obtenerAsignaciones = async (req, res) => {
  try {
    const ubicaciones = await Ubicacion.find({ user: req.user.id }).populate("vanos");
    res.json(ubicaciones);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener asignaciones", error: error.message });
  }
};

/**
 * 📌 Eliminar una asignación específica
 */
export const eliminarAsignacion = async (req, res) => {
  try {
    const { ubicacionId, vanoId } = req.params;

    // Buscar la ubicación y verificar que pertenece al usuario
    const ubicacion = await Ubicacion.findOne({ _id: ubicacionId, user: req.user.id });
    if (!ubicacion) return res.status(404).json({ message: "Ubicación no encontrada." });

    // Encontrar el vano y eliminar sus medidas
    const vano = ubicacion.vanos.find(v => v._id.toString() === vanoId);
    if (!vano) return res.status(404).json({ message: "Vano no encontrado." });

    vano.medidas = [];
    await ubicacion.save();

    res.json({ message: "Asignación eliminada correctamente." });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar asignación", error: error.message });
  }
};

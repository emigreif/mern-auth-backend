import Ubicacion from "../models/Ubicacion.js";

// 🔹 Obtener todas las ubicaciones del usuario autenticado
export const listarUbicaciones = async (req, res) => {
  try {
    const ubicaciones = await Ubicacion.find({ user: req.user.id });
    res.json(ubicaciones);
  } catch (error) {
    console.error("Error al obtener ubicaciones:", error);
    res.status(500).json({ message: "Error al obtener ubicaciones", error: error.message });
  }
};

// 🔹 Obtener una ubicación por ID
export const obtenerUbicacion = async (req, res) => {
  try {
    const ubicacion = await Ubicacion.findOne({ _id: req.params.id, user: req.user.id });
    if (!ubicacion) return res.status(404).json({ message: "Ubicación no encontrada" });
    res.json(ubicacion);
  } catch (error) {
    console.error("Error al obtener ubicación:", error);
    res.status(500).json({ message: "Error al obtener ubicación", error: error.message });
  }
};

// 🔹 Crear una nueva ubicación
export const crearUbicacion = async (req, res) => {
  try {
    const { nombre, direccion, coordenadas } = req.body;

    if (!nombre || !direccion) {
      return res.status(400).json({ message: "Los campos nombre y dirección son obligatorios" });
    }

    const nuevaUbicacion = new Ubicacion({
      nombre,
      direccion,
      coordenadas,
      user: req.user.id,
    });

    const ubicacionGuardada = await nuevaUbicacion.save();
    res.status(201).json(ubicacionGuardada);
  } catch (error) {
    console.error("Error al crear ubicación:", error);
    res.status(400).json({ message: "Error al crear ubicación", error: error.message });
  }
};

// 🔹 Actualizar una ubicación
export const actualizarUbicacion = async (req, res) => {
  try {
    const ubicacionActualizada = await Ubicacion.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!ubicacionActualizada) return res.status(404).json({ message: "Ubicación no encontrada" });

    res.json(ubicacionActualizada);
  } catch (error) {
    console.error("Error al actualizar ubicación:", error);
    res.status(400).json({ message: "Error al actualizar ubicación", error: error.message });
  }
};

// 🔹 Eliminar una ubicación
export const eliminarUbicacion = async (req, res) => {
  try {
    const ubicacionEliminada = await Ubicacion.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!ubicacionEliminada) return res.status(404).json({ message: "Ubicación no encontrada" });

    res.json({ message: "Ubicación eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar ubicación:", error);
    res.status(500).json({ message: "Error al eliminar ubicación", error: error.message });
  }
};

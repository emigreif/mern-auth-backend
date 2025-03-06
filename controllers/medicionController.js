import Medicion from "../models/Medicion.js";

// 🔹 Obtener todas las mediciones del usuario autenticado
export const listarMediciones = async (req, res) => {
  try {
    const mediciones = await Medicion.find({ user: req.user.id }).populate("obra");
    res.json(mediciones);
  } catch (error) {
    console.error("Error al listar mediciones:", error);
    res.status(500).json({ message: "Error al obtener mediciones", error: error.message });
  }
};

// 🔹 Obtener una medición por ID
export const obtenerMedicion = async (req, res) => {
  try {
    const medicion = await Medicion.findOne({ _id: req.params.id, user: req.user.id }).populate("obra");
    if (!medicion) {
      return res.status(404).json({ message: "Medición no encontrada" });
    }
    res.json(medicion);
  } catch (error) {
    console.error("Error al obtener medición:", error);
    res.status(500).json({ message: "Error al obtener medición", error: error.message });
  }
};

// 🔹 Crear una nueva medición
export const crearMedicion = async (req, res) => {
  try {
    const { obra, fecha, observaciones, medidas } = req.body;

    if (!obra) {
      return res.status(400).json({ message: "El campo 'obra' es obligatorio" });
    }

    const nuevaMedicion = new Medicion({
      obra,
      fecha: fecha || new Date(), // Si no se envía fecha, se asigna la actual
      observaciones,
      medidas,
      user: req.user.id,
    });

    const medicionGuardada = await nuevaMedicion.save();
    res.status(201).json(medicionGuardada);
  } catch (error) {
    console.error("Error al crear medición:", error);
    res.status(400).json({ message: "Error al crear medición", error: error.message });
  }
};

// 🔹 Actualizar una medición existente
export const actualizarMedicion = async (req, res) => {
  try {
    const { id } = req.params;

    const medicionActualizada = await Medicion.findOneAndUpdate(
      { _id: id, user: req.user.id },
      req.body,
      { new: true }
    ).populate("obra");

    if (!medicionActualizada) {
      return res.status(404).json({ message: "Medición no encontrada" });
    }

    res.json(medicionActualizada);
  } catch (error) {
    console.error("Error al actualizar medición:", error);
    res.status(400).json({ message: "Error al actualizar medición", error: error.message });
  }
};

// 🔹 Eliminar una medición
export const eliminarMedicion = async (req, res) => {
  try {
    const { id } = req.params;

    const medicionEliminada = await Medicion.findOneAndDelete({ _id: id, user: req.user.id });

    if (!medicionEliminada) {
      return res.status(404).json({ message: "Medición no encontrada" });
    }

    res.json({ message: "Medición eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar medición:", error);
    res.status(500).json({ message: "Error al eliminar medición", error: error.message });
  }
};

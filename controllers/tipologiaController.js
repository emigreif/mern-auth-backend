import Tipologia from "../models/Tipologia.js";

// 🔹 Obtener todas las tipologías del usuario autenticado
export const listarTipologias = async (req, res) => {
  try {
    const tipologias = await Tipologia.find({ user: req.user.id });
    res.json(tipologias);
  } catch (error) {
    console.error("Error al obtener tipologías:", error);
    res.status(500).json({ message: "Error al obtener tipologías", error: error.message });
  }
};

// 🔹 Obtener una tipología por ID
export const obtenerTipologia = async (req, res) => {
  try {
    const tipologia = await Tipologia.findOne({ _id: req.params.id, user: req.user.id });
    if (!tipologia) return res.status(404).json({ message: "Tipología no encontrada" });
    res.json(tipologia);
  } catch (error) {
    console.error("Error al obtener tipología:", error);
    res.status(500).json({ message: "Error al obtener tipología", error: error.message });
  }
};

// 🔹 Crear una nueva tipología
export const crearTipologia = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    if (!nombre) {
      return res.status(400).json({ message: "El nombre es obligatorio" });
    }

    const nuevaTipologia = new Tipologia({
      nombre,
      descripcion,
      user: req.user.id,
    });

    const tipologiaGuardada = await nuevaTipologia.save();
    res.status(201).json(tipologiaGuardada);
  } catch (error) {
    console.error("Error al crear tipología:", error);
    res.status(400).json({ message: "Error al crear tipología", error: error.message });
  }
};

// 🔹 Actualizar una tipología
export const actualizarTipologia = async (req, res) => {
  try {
    const tipologiaActualizada = await Tipologia.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!tipologiaActualizada) return res.status(404).json({ message: "Tipología no encontrada" });

    res.json(tipologiaActualizada);
  } catch (error) {
    console.error("Error al actualizar tipología:", error);
    res.status(400).json({ message: "Error al actualizar tipología", error: error.message });
  }
};

// 🔹 Eliminar una tipología
export const eliminarTipologia = async (req, res) => {
  try {
    const tipologiaEliminada = await Tipologia.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!tipologiaEliminada) return res.status(404).json({ message: "Tipología no encontrada" });

    res.json({ message: "Tipología eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar tipología:", error);
    res.status(500).json({ message: "Error al eliminar tipología", error: error.message });
  }
};

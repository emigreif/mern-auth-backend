import Obra from "../models/Obra.js";

// ✅ OBTENER TODAS LAS OBRAS
export const listarObras = async (req, res) => {
  try {
    const obras = await Obra.find({ user: req.user.id }).populate("cliente");
    res.json(obras);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener obras", error: error.message });
  }
};

// ✅ OBTENER UNA OBRA POR ID
export const obtenerObra = async (req, res) => {
  try {
    const obra = await Obra.findOne({ _id: req.params.id, user: req.user.id }).populate("cliente");
    if (!obra) return res.status(404).json({ message: "Obra no encontrada" });
    res.json(obra);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener obra", error: error.message });
  }
};

// ✅ CREAR UNA OBRA
export const crearObra = async (req, res) => {
  try {
    const nuevaObra = new Obra({ ...req.body, user: req.user.id });
    const obraGuardada = await nuevaObra.save();
    res.status(201).json(obraGuardada);
  } catch (error) {
    res.status(400).json({ message: "Error al crear obra", error: error.message });
  }
};

// ✅ ACTUALIZAR OBRA
export const actualizarObra = async (req, res) => {
  try {
    const obraActualizada = await Obra.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!obraActualizada) return res.status(404).json({ message: "Obra no encontrada" });
    res.json(obraActualizada);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar obra", error: error.message });
  }
};

// ✅ ELIMINAR OBRA
export const eliminarObra = async (req, res) => {
  try {
    const obraEliminada = await Obra.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!obraEliminada) return res.status(404).json({ message: "Obra no encontrada" });
    res.json({ message: "Obra eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar obra", error: error.message });
  }
};

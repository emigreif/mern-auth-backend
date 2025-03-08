import Presupuesto from "../models/Presupuesto.js";

// ✅ OBTENER PRESUPUESTOS
export const listarPresupuestos = async (req, res) => {
  try {
    const presupuestos = await Presupuesto.find({ user: req.user.id });
    res.json(presupuestos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener presupuestos", error: error.message });
  }
};

// ✅ OBTENER UN PRESUPUESTO
export const obtenerPresupuesto = async (req, res) => {
  try {
    const presupuesto = await Presupuesto.findOne({ _id: req.params.id, user: req.user.id });
    if (!presupuesto) return res.status(404).json({ message: "Presupuesto no encontrado" });
    res.json(presupuesto);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener presupuesto", error: error.message });
  }
};

// ✅ CREAR PRESUPUESTO
export const crearPresupuesto = async (req, res) => {
  try {
    const nuevoPresupuesto = new Presupuesto({ ...req.body, user: req.user.id });
    const presupuestoGuardado = await nuevoPresupuesto.save();
    res.status(201).json(presupuestoGuardado);
  } catch (error) {
    res.status(400).json({ message: "Error al crear presupuesto", error: error.message });
  }
};

// ✅ ACTUALIZAR PRESUPUESTO
export const actualizarPresupuesto = async (req, res) => {
  try {
    const presupuestoActualizado = await Presupuesto.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!presupuestoActualizado) return res.status(404).json({ message: "Presupuesto no encontrado" });
    res.json(presupuestoActualizado);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar presupuesto", error: error.message });
  }
};

// ✅ ELIMINAR PRESUPUESTO
export const eliminarPresupuesto = async (req, res) => {
  try {
    const presupuestoEliminado = await Presupuesto.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!presupuestoEliminado) return res.status(404).json({ message: "Presupuesto no encontrado" });
    res.json({ message: "Presupuesto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar presupuesto", error: error.message });
  }
};

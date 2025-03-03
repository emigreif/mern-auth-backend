// backend/controllers/presupuestoController.js
import Presupuesto from '../models/Presupuesto.js';

// Crear presupuesto
export const crearPresupuesto = async (req, res) => {
  try {
    const nuevo = new Presupuesto(req.body);
    const guardado = await nuevo.save();
    return res.status(201).json(guardado);
  } catch (error) {
    console.error("Error creando presupuesto:", error);
    return res.status(500).json({ message: "Error al crear presupuesto" });
  }
};

// Listar todos
export const listarPresupuestos = async (req, res) => {
  try {
    const presupuestos = await Presupuesto.find().populate('idObra');
    return res.json(presupuestos);
  } catch (error) {
    console.error("Error al listar presupuestos:", error);
    return res.status(500).json({ message: "Error al listar presupuestos" });
  }
};

// Obtener uno por ID
export const obtenerPresupuesto = async (req, res) => {
  try {
    const { id } = req.params;
    const presupuesto = await Presupuesto.findById(id).populate('idObra');
    if (!presupuesto) {
      return res.status(404).json({ message: "Presupuesto no encontrado" });
    }
    return res.json(presupuesto);
  } catch (error) {
    console.error("Error al obtener presupuesto:", error);
    return res.status(500).json({ message: "Error al obtener presupuesto" });
  }
};

// Actualizar
export const actualizarPresupuesto = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Presupuesto.findByIdAndUpdate(id, req.body, {
      new: true
    });
    if (!updated) {
      return res.status(404).json({ message: "Presupuesto no encontrado" });
    }
    return res.json(updated);
  } catch (error) {
    console.error("Error al actualizar presupuesto:", error);
    return res.status(500).json({ message: "Error al actualizar presupuesto" });
  }
};

// Eliminar
export const eliminarPresupuesto = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await Presupuesto.findByIdAndDelete(id);
    if (!eliminado) {
      return res.status(404).json({ message: "Presupuesto no encontrado" });
    }
    return res.json({ message: "Presupuesto eliminado" });
  } catch (error) {
    console.error("Error al eliminar presupuesto:", error);
    return res.status(500).json({ message: "Error al eliminar presupuesto" });
  }
};

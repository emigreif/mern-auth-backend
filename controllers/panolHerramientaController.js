import Herramienta from "../models/PanolHerramienta.js";
import { handleMongooseError } from "../utils/validationHelpers.js";

// ✅ Obtener todas las herramientas del usuario
export const obtenerHerramientas = async (req, res) => {
  try {
    console.log("✅ obtenerHerramientas called by", req.user.id);
    const herramientas = await Herramienta.find({ user: req.user.id });
    res.json(herramientas);
  } catch (err) {
    console.error("❌ Error en obtenerHerramientas:", err);
    res.status(500).json({ message: "Error al obtener herramientas" });
  }
};

// ✅ Crear herramienta
export const crearHerramienta = async (req, res) => {
  try {
    const { marca, modelo, descripcion, numeroSerie, estado } = req.body;
    if (!marca || !modelo || !descripcion || !numeroSerie) {
      return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    const nueva = await Herramienta.create({
      user: req.user.id,
      marca,
      modelo,
      descripcion,
      numeroSerie,
      estado,
      historial: [{ fecha: new Date(), estadoNuevo: estado }],
    });

    res.status(201).json(nueva);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

// ✅ Editar herramienta
export const actualizarHerramienta = async (req, res) => {
  try {
    const { id } = req.params;
    const herramienta = await Herramienta.findOne({ _id: id, user: req.user.id });
    if (!herramienta) return res.status(404).json({ message: "No encontrada" });

    Object.assign(herramienta, req.body);
    await herramienta.save();

    res.json(herramienta);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

// ✅ Eliminar herramienta
export const eliminarHerramienta = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await Herramienta.findOneAndDelete({ _id: id, user: req.user.id });

    if (!eliminado) return res.status(404).json({ message: "No encontrada" });
    res.json({ message: "Herramienta eliminada" });
  } catch (error) {
    handleMongooseError(res, error);
  }
};

// ✅ Registrar movimiento
export const registrarMovimiento = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, obra, responsable } = req.body;

    const herramienta = await Herramienta.findOne({ _id: id, user: req.user.id });
    if (!herramienta) return res.status(404).json({ message: "No encontrada" });

    herramienta.historial.push({
      fecha: new Date(),
      estadoAnterior: herramienta.estado,
      estadoNuevo: estado,
      obra,
      responsable,
    });

    herramienta.estado = estado;
    herramienta.obra = estado === "en obra" ? obra : null;
    herramienta.responsable = estado === "en obra" ? responsable : null;

    await herramienta.save();
    res.json(herramienta);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

// ✅ Asignar a obra directamente
export const asignarHerramienta = async (req, res) => {
  try {
    const { herramienta: herramientaId, obra, responsable } = req.body;

    const herramienta = await Herramienta.findOne({ _id: herramientaId, user: req.user.id });
    if (!herramienta) return res.status(404).json({ message: "Herramienta no encontrada" });

    herramienta.historial.push({
      fecha: new Date(),
      estadoAnterior: herramienta.estado,
      estadoNuevo: "en obra",
      obra,
      responsable,
    });

    herramienta.estado = "en obra";
    herramienta.obra = obra;
    herramienta.responsable = responsable;

    await herramienta.save();
    res.json({ message: "Asignada correctamente", herramienta });
  } catch (error) {
    handleMongooseError(res, error);
  }
};

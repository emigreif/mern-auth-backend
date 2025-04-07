import Vidrio from "../models/PanolVidrio.js";
import { handleMongooseError, assertValidId } from "../utils/validationHelpers.js";

/** 🔄 Obtener todos los vidrios del usuario */
export const obtenerVidrios = async (req, res) => {
  try {
    const vidrios = await Vidrio.find({ user: req.user.id });
    res.json(vidrios);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

/** ➕ Crear nuevo vidrio */
export const crearVidrio = async (req, res) => {
  try {
    const nuevo = new Vidrio({ ...req.body, user: req.user.id });
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

/** ✏️ Actualizar vidrio existente */
export const actualizarVidrio = async (req, res) => {
  try {
    assertValidId(req.params.id, "Vidrio");
    const vidrio = await Vidrio.findOne({ _id: req.params.id, user: req.user.id });
    if (!vidrio) return res.status(404).json({ message: "Vidrio no encontrado" });

    Object.assign(vidrio, req.body);
    await vidrio.save();
    res.json(vidrio);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

/** 🗑️ Eliminar vidrio */
export const eliminarVidrio = async (req, res) => {
  try {
    assertValidId(req.params.id, "Vidrio");
    const vidrio = await Vidrio.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!vidrio) return res.status(404).json({ message: "Vidrio no encontrado" });

    res.json({ message: "Vidrio eliminado correctamente" });
  } catch (error) {
    handleMongooseError(res, error);
  }
};

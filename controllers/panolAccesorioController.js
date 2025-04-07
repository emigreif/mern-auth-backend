import Accesorio from "../models/PanolAccesorio.js";
import { handleMongooseError, assertValidId } from "../utils/validationHelpers.js";

/** 🔄 Obtener todos los accesorios del usuario */
export const obtenerAccesorios = async (req, res) => {
  try {
    const accesorios = await Accesorio.find({ user: req.user.id });
    res.json(accesorios);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

/** ➕ Crear nuevo accesorio */
export const crearAccesorio = async (req, res) => {
  try {
    const nuevo = new Accesorio({ ...req.body, user: req.user.id });
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

/** ✏️ Actualizar accesorio existente */
export const actualizarAccesorio = async (req, res) => {
  try {
    assertValidId(req.params.id, "Accesorio");
    const accesorio = await Accesorio.findOne({ _id: req.params.id, user: req.user.id });
    if (!accesorio) return res.status(404).json({ message: "Accesorio no encontrado" });

    Object.assign(accesorio, req.body);
    await accesorio.save();
    res.json(accesorio);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

/** 🗑️ Eliminar accesorio */
export const eliminarAccesorio = async (req, res) => {
  try {
    assertValidId(req.params.id, "Accesorio");
    const accesorio = await Accesorio.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!accesorio) return res.status(404).json({ message: "Accesorio no encontrado" });

    res.json({ message: "Accesorio eliminado correctamente" });
  } catch (error) {
    handleMongooseError(res, error);
  }
};

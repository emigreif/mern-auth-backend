import Perfil from "../models/PanolPerfil.js";
import { handleMongooseError, assertValidId } from "../utils/validationHelpers.js";

/** 🔄 Obtener todos los perfiles */
export const obtenerPerfiles = async (req, res) => {
  try {
    const perfiles = await Perfil.find({ user: req.user.id });
    res.json(perfiles);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

/** ➕ Crear nuevo perfil */
export const crearPerfil = async (req, res) => {
  try {
    const nuevo = new Perfil({ ...req.body, user: req.user.id });
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

/** ✏️ Editar perfil existente */
export const actualizarPerfil = async (req, res) => {
  try {
    assertValidId(req.params.id, "Perfil");
    const perfil = await Perfil.findOne({ _id: req.params.id, user: req.user.id });
    if (!perfil) return res.status(404).json({ message: "Perfil no encontrado" });

    Object.assign(perfil, req.body);
    await perfil.save();
    res.json(perfil);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

/** 🗑️ Eliminar perfil */
export const eliminarPerfil = async (req, res) => {
  try {
    assertValidId(req.params.id, "Perfil");
    const perfil = await Perfil.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!perfil) return res.status(404).json({ message: "Perfil no encontrado" });

    res.json({ message: "Perfil eliminado correctamente" });
  } catch (error) {
    handleMongooseError(res, error);
  }
};

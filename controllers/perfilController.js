import Perfil from "../models/Perfil.js";
import User from "../models/User.js";

// 📌 Crear un nuevo perfil (Solo Administrador)
export const crearPerfil = async (req, res) => {
  try {
    if (!req.user.esAdmin) return res.status(403).json({ message: "Acceso denegado" });

    const { nombre, permisos } = req.body;
    const perfilExistente = await Perfil.findOne({ nombre });

    if (perfilExistente) return res.status(400).json({ message: "El perfil ya existe" });

    const nuevoPerfil = new Perfil({ nombre, permisos });
    await nuevoPerfil.save();

    res.status(201).json(nuevoPerfil);
  } catch (error) {
    res.status(500).json({ message: "Error al crear perfil", error });
  }
};

// 📌 Editar perfil (Solo Administrador)
export const editarPerfil = async (req, res) => {
  try {
    if (!req.user.esAdmin) return res.status(403).json({ message: "Acceso denegado" });

    const { perfilId, permisos } = req.body;
    const perfil = await Perfil.findById(perfilId);
    if (!perfil) return res.status(404).json({ message: "Perfil no encontrado" });

    perfil.permisos = permisos;
    await perfil.save();

    res.status(200).json(perfil);
  } catch (error) {
    res.status(500).json({ message: "Error al editar perfil", error });
  }
};

// 📌 Eliminar perfil (Solo Administrador)
export const eliminarPerfil = async (req, res) => {
  try {
    if (!req.user.esAdmin) return res.status(403).json({ message: "Acceso denegado" });

    await Perfil.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Perfil eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar perfil", error });
  }
};

// 📌 Asignar perfil a usuario
export const asignarPerfil = async (req, res) => {
  try {
    if (!req.user.esAdmin) return res.status(403).json({ message: "Acceso denegado" });

    const { userId, perfilId } = req.body;
    const usuario = await User.findById(userId);
    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });

    if (!usuario.perfiles.includes(perfilId)) {
      usuario.perfiles.push(perfilId);
      await usuario.save();
    }

    res.status(200).json({ message: "Perfil asignado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al asignar perfil", error });
  }
};

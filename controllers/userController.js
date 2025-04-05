import User from "../models/user.js";
import bcrypt from "bcryptjs";
import Perfil from "../models/perfil.js";
import { handleMongooseError } from "../utils/validationHelpers.js";

/**
 * ✅ Obtener perfil de usuario autenticado (sin contraseña)
 */
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(user);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

/**
 * 🔄 Actualizar perfil de usuario (incluye cambio de contraseña)
 */
export const updateUserProfile = async (req, res) => {
  try {
    const { firstName, lastName, email, password, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Si quiere cambiar la contraseña
    if (password && newPassword) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "La contraseña actual no es válida" });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    // Actualizar otros campos (solo si están presentes)
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email; // ⚠️ podría validar que sea único

    await user.save();

    const updatedUser = await User.findById(user._id).select("-password");

    res.status(200).json({
      message: "Perfil actualizado correctamente",
      user: updatedUser
    });
  } catch (error) {
    handleMongooseError(res, error);
  }
};

/**
 * ✅ Establecer perfil activo para el usuario
 */
export const seleccionarPerfil = async (req, res) => {
  try {
    const { userId, perfilId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const perfil = await Perfil.findOne({ _id: perfilId, userId });
    if (!perfil) {
      return res.status(403).json({ message: "No tienes acceso a este perfil" });
    }

    // (Opcional) Guardar como perfil activo en la colección User
    // user.perfilActivo = perfilId;
    // await user.save();

    res.status(200).json({
      message: "Perfil seleccionado correctamente",
      perfil
    });
  } catch (error) {
    handleMongooseError(res, error);
  }
};

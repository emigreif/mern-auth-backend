// controllers/userController.js
import User from "../models/user.js";
import bcrypt from "bcryptjs";

/**
 * Obtiene el perfil de usuario
 */
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Actualiza datos del perfil y permite cambiar contraseña
 */
export const updateUserProfile = async (req, res) => {
  try {
    const { firstName, lastName, email, password, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Cambiar contraseña si se envían password y newPassword
    if (password && newPassword) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "La contraseña actual no es válida" });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    // Actualizar otros campos
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email; // Ojo con validación de email único

    await user.save();
    const updatedUser = await User.findById(user._id).select("-password");
    res.status(200).json({
      message: "Perfil actualizado correctamente",
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: "Error del servidor", error: error.message });
  }
};

/**
 * Seleccionar perfil activo
 */
export const seleccionarPerfil = async (req, res) => {
  try {
    const { userId, perfilId } = req.body;

    const usuario = await User.findById(userId);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Suponiendo que el User tiene un array "perfiles" y un "perfilActivo"
    // Ajusta según tu modelo real
    if (!usuario.perfiles.includes(perfilId)) {
      return res.status(403).json({ message: "No tienes acceso a este perfil" });
    }

    usuario.perfilActivo = perfilId;
    await usuario.save();

    res.status(200).json({
      message: "Perfil seleccionado correctamente",
      perfilActivo: usuario.perfilActivo
    });
  } catch (error) {
    res.status(500).json({ message: "Error al seleccionar perfil", error });
  }
};

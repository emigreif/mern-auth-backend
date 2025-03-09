// backend/controllers/userController.js
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Obtiene el perfil de usuario (ejemplo existente)
export const getUserProfile = async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password'); // sin mostrar la contraseña
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
export const seleccionarPerfil = async (req, res) => {
  try {
    const { userId, perfilId } = req.body;

    const usuario = await User.findById(userId);
    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });

    if (!usuario.perfiles.includes(perfilId)) {
      return res.status(403).json({ message: "No tienes acceso a este perfil" });
    }

    usuario.perfilActivo = perfilId;
    await usuario.save();

    res.status(200).json({ message: "Perfil seleccionado correctamente", perfilActivo: usuario.perfilActivo });
  } catch (error) {
    res.status(500).json({ message: "Error al seleccionar perfil", error });
  }
};
// Actualiza datos del perfil (nombre, email, etc.) y permite cambiar contraseña
export const updateUserProfile = async (req, res) => {
  try {
    // Estos campos vendrán en el body de la petición
    const { firstName, lastName, email, password, newPassword } = req.body;

    // req.user proviene del middleware "protect"
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // 1. Si se desea cambiar la contraseña
    if (password && newPassword) {
      // Verificar la contraseña actual
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'La contraseña actual no es válida' });
      }
      // Encriptar la nueva contraseña
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    // 2. Actualizar otros campos (solo si vienen en el body)
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email; // Ojo con la validación de email único

    // Guardar cambios
    await user.save();

    // Opcional: retornar el usuario actualizado (sin password)
    const updatedUser = await User.findById(user._id).select('-password');
    res.status(200).json({
      message: 'Perfil actualizado correctamente',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

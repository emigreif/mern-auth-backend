/* // backend/controllers/authController.js
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

// 1. REGISTRO
export const register = async (req, res) => {
  try {
    const {
      email,
      password,
      repeatPassword,
      firstName,
      lastName,
      razonSocial,
      cuit,
      plan,
      cantidadUsuarios,
      direccion,
      localidad,
      codigoPostal
    } = req.body;

    // Verificar campos obligatorios
    if (!email || !password || !repeatPassword || !firstName || !lastName) {
      return res.status(400).json({ message: "Todos los campos obligatorios deben ser completados" });
    }

    // Verificar contraseñas
    if (password !== repeatPassword) {
      return res.status(400).json({ message: "Las contraseñas no coinciden" });
    }

    // Chequear si ya existe el usuario
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    // Cifrar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear nuevo usuario
    const newUser = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      razonSocial,
      cuit,
      plan,
      cantidadUsuarios,
      direccion,
      localidad,
      codigoPostal
    });

    await newUser.save();

    return res.status(201).json({ message: "Usuario registrado con éxito" });
  } catch (error) {
    return res.status(500).json({
      message: 'Error registrando usuario',
      error: error.message || error
    });
  }
};

// 2. LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }

    // Generar token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    return res.json({ token, user });
  } catch (error) {
    return res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};

// 3. LOGOUT
export const logout = (req, res) => {
  try {
    // Si usas cookies para el token:
    res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'None' });
    return res.status(200).json({ message: 'Logout exitoso' });
  } catch (error) {
    console.error('Error al hacer logout', error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

// 4. FORGOT PASSWORD (genera token y envía correo)
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Se requiere un email" });
    }

    // Verificar si el usuario existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No existe un usuario con ese email" });
    }

    // Generar token aleatorio
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Asignar token y fecha de expiración (1 hora)
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hora
    await user.save();

    // Configurar transporter de nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail', // o el proveedor que uses
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Construir el link de reseteo (ajusta la URL a tu frontend)
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    // Contenido del email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Recuperar contraseña',
      text: `Has solicitado un cambio de contraseña. Haz clic aquí para restablecerla: ${resetUrl}`,
    };

    // Enviar correo
    await transporter.sendMail(mailOptions);

    res.json({
      message: "Email de recuperación enviado. Revisa tu bandeja de entrada.",
    });
  } catch (error) {
    console.error("Error en forgotPassword:", error);
    res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};

// 5. RESET PASSWORD (usa el token para validar)
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params; // resetToken en la URL
    const { newPassword } = req.body;

    // Buscar usuario con ese token y que no esté expirado
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // Debe ser mayor a la fecha actual
    });

    if (!user) {
      return res.status(400).json({ message: "Token inválido o expirado" });
    }

    if (!newPassword) {
      return res.status(400).json({ message: "La nueva contraseña es requerida" });
    }

    // Hashear la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Limpiar campos de reseteo
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: "Contraseña restablecida con éxito" });
  } catch (error) {
    console.error("Error en resetPassword:", error);
    res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};
 */

// backend/controllers/authController.js
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

// 1. REGISTRO
export const register = async (req, res) => {
  try {
    const {
      email,
      password,
      repeatPassword,
      firstName,
      lastName,
      razonSocial,
      cuit,
      plan,
      cantidadUsuarios,
      direccion,
      localidad,
      codigoPostal
    } = req.body;

    if (password !== repeatPassword) {
      return res.status(400).json({ message: "Las contraseñas no coinciden" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      razonSocial,
      cuit,
      plan,
      cantidadUsuarios: cantidadUsuarios || 1,
      direccion,
      localidad,
      codigoPostal
    });

    await newUser.save();
    return res.status(201).json({ message: "Usuario registrado con éxito" });
  } catch (error) {
    return res.status(500).json({ message: "Error registrando usuario", error: error.message });
  }
};

// 2. LOGIN (se asume que ya lo tienes en tu code: login con email/pass)

// 3. FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Se requiere un email" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "No existe un usuario con ese email" });

    // Generar token
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hora
    await user.save();

    // Enviar correo con nodemailer ...
    // ...
    return res.json({ message: "Email de recuperación enviado." });
  } catch (error) {
    res.status(500).json({ message: "Error en forgotPassword", error: error.message });
  }
};

// 4. RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ message: "Token inválido o expirado" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Contraseña restablecida con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error en resetPassword", error: error.message });
  }
};

import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import Perfil from "../models/perfil.js";
import crypto from "crypto";
import { handleMongooseError } from "../utils/validationHelpers.js"; // ✅ Nuevo

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
      return res.status(400).json({
        message: "Todos los campos obligatorios deben ser completados"
      });
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
      cantidadUsuarios: cantidadUsuarios || 1,
      direccion,
      localidad,
      codigoPostal
    });

    await newUser.save();

    // Crear perfil admin por defecto con password "1234" hasheada
    const hashedPass = await bcrypt.hash("1234", 10);

    const perfilAdmin = new Perfil({
      nombre: "admin",
      password: hashedPass,
      userId: newUser._id,
      permisos: {
        obras: true,
        presupuestos: true,
        mediciones: true,
        compras: true,
        panol: true,
        nomina: true,
        clientes: true,
        proveedores: true,
        configuracion: true,
        contabilidad: true,
        reportes: true,
        planner: true,
        calendario: true
      }
    });
    await perfilAdmin.save();

    return res.status(201).json({ message: "Usuario registrado con éxito" });
  } catch (error) {
    return handleMongooseError(res, error); // ✅ Aplica validación de duplicados, schema, etc.
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

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h"
    });

    const { password: _, ...userData } = user._doc;
    return res.json({ token, user: userData });
  } catch (error) {
    return res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};

// 3. LOGOUT
export const logout = (req, res) => {
  try {
    return res.status(200).json({ message: "Logout exitoso" });
  } catch (error) {
    console.error("Error al hacer logout", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

// 4. FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Se requiere un email" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No existe un usuario con ese email" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1h
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Recuperar contraseña",
      text: `Has solicitado un cambio de contraseña. Haz clic aquí para restablecerla: ${resetUrl}`
    };

    await transporter.sendMail(mailOptions);

    res.json({
      message: "Email de recuperación enviado. Revisa tu bandeja de entrada."
    });
  } catch (error) {
    console.error("Error en forgotPassword:", error);
    res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};

// 5. RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Token inválido o expirado" });
    }

    if (!newPassword) {
      return res.status(400).json({ message: "La nueva contraseña es requerida" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: "Contraseña restablecida con éxito" });
  } catch (error) {
    console.error("Error en resetPassword:", error);
    res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};

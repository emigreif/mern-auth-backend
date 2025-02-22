import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    console.log("📩 Datos recibidos en el backend:", req.body); // <-- Verifica qué datos llegan

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

    // 1️⃣ Verificar si faltan campos obligatorios
    if (!email || !password || !repeatPassword || !firstName || !lastName) {
      return res.status(400).json({ message: "Todos los campos obligatorios deben ser completados" });
    }

    // 2️⃣ Verificar contraseñas
    if (password !== repeatPassword) {
      return res.status(400).json({ message: "Las contraseñas no coinciden" });
    }

    // 3️⃣ Chequear si ya existe un usuario con el mismo email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("⚠️ Usuario ya existe:", email);
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    // 4️⃣ Cifrar la contraseña con bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5️⃣ Crear nuevo usuario
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
    console.log("✅ Usuario creado con éxito:", newUser);
    return res.status(201).json({ message: "Usuario registrado con éxito" });
  } catch (error) {
    console.error("❌ Error en el servidor:", error); // <-- Esto imprimirá errores en la consola
    return res.status(500).json({ message: "Error registrando usuario", error });
  }
};
/* 

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

    // Verificar contraseñas
    if (password !== repeatPassword) {
      return res.status(400).json({ message: 'Las contraseñas no coinciden' });
    }

    // Chequear si ya existe un usuario con el mismo email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Cifrar la contraseña con bcrypt
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
    return res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error registrando usuario' });
  }
};
 */
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
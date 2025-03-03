import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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

    return res.status(201).json({ message: "Usuario registrado con éxito" });

  } catch (error) {
    return res.status(500).json({
      message: 'Error registrando usuario',
      error: error.message || error
    });
  }
};


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
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    return res.json({ token, user });

  } catch (error) {
    return res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};

export const logout = (req, res) => {
  try {
    // Si guardas JWT en una cookie:
    // - Limpia la cookie con un maxAge = 0 o usando res.clearCookie
    res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'None' });
    
    // Si guardas el token en localStorage del frontend, 
    // aquí realmente no hay mucho que hacer del lado del servidor 
    // más que notificar que se está "deslogueando".
    
    return res.status(200).json({ message: 'Logout exitoso' });
  } catch (error) {
    console.error('Error al hacer logout', error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};
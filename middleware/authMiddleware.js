/* // backend/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  let token = req.headers.authorization;

  if (token && token.startsWith('Bearer')) {
    try {
      token = token.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
}; */

// backend/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js"; // Asegúrate de tener la ruta correcta a tu modelo User

export const protect = async (req, res, next) => {
  let token = req.headers.authorization;

  if (token && token.startsWith("Bearer")) {
    try {
      // Extraer el token sin la palabra "Bearer"
      token = token.split(" ")[1];

      // Decodificar el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Verificar que el usuario aún exista o siga activo
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ message: "Usuario no encontrado o inactivo" });
      }

      // Guardar algunos datos en req.user (puedes poner lo que necesites)
      req.user = {
        id: user._id,
        email: user.email,
        esAdmin: user.esAdmin,
        // etc...
      };

      next();
    } catch (error) {
      console.error("Error en protect middleware:", error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

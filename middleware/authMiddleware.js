// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/user.js"; // Ajusta la ruta si difiere en tu estructura

/**
 * Middleware protect:
 *  - Verifica el token JWT en Authorization: Bearer <token>
 *  - Decodifica y asigna req.user con el user de la DB
 *  - Si falla, retorna 401
 */
export const protect = async (req, res, next) => {
  let token = req.headers.authorization;

  if (token && token.startsWith("Bearer ")) {
    try {
      // Extraer el token sin la palabra "Bearer"
      token = token.split(" ")[1];

      // Decodificar el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Verificar que el usuario aún exista
      const user = await User.findById(decoded.id);
      if (!user) {
        return res
          .status(401)
          .json({ message: "Usuario no encontrado o inactivo" });
      }

      // Guardar datos en req.user
      req.user = {
        id: user._id,
        email: user.email,
        esAdmin: user.esAdmin
      };

      next();
    } catch (error) {
      console.error("Error en protect middleware:", error);
      res.status(401).json({ message: "Token inválido o expirado" });
    }
  } else {
    res.status(401).json({ message: "No autorizado, faltan credenciales" });
  }
};

import Perfil from "../models/perfil.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { handleMongooseError } from "../utils/validationHelpers.js";

/**
 * 📌 Obtener todos los perfiles de un usuario
 * - Si no hay, crea uno por defecto con nombre "admin" y password "1234"
 */
export const listarPerfiles = async (req, res) => {
  try {
    const userId = req.user.id;
    let perfiles = await Perfil.find({ userId });

    if (perfiles.length === 0) {
      const hashedPass = await bcrypt.hash("1234", 10);

      const perfilAdmin = new Perfil({
        nombre: "admin",
        password: hashedPass,
        userId,
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
      perfiles = [perfilAdmin];
    }

    res.json(perfiles);
  } catch (error) {
    console.error("Error al listar perfiles:", error);
    handleMongooseError(res, error);
  }
};

/**
 * 📌 Crear un nuevo perfil
 * - Respeta el límite de cantidadUsuarios del User
 */
export const crearPerfil = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const count = await Perfil.countDocuments({ userId });
    if (count >= user.cantidadUsuarios) {
      return res.status(403).json({
        message: `Has alcanzado el máximo de perfiles permitidos (${user.cantidadUsuarios}).`
      });
    }

    const { nombre, password, permisos } = req.body;

    const hashedPass = await bcrypt.hash(password, 10);

    const nuevoPerfil = new Perfil({
      nombre,
      password: hashedPass,
      permisos: permisos || {},
      userId
    });

    await nuevoPerfil.save();
    res.status(201).json(nuevoPerfil);
  } catch (error) {
    console.error("Error al crear perfil:", error);
    handleMongooseError(res, error);
  }
};

/**
 * 📌 Login del segundo nivel (perfil)
 */
export const loginPerfil = async (req, res) => {
  try {
    const userId = req.user.id;
    const { perfilName, perfilPass } = req.body;

    const perfil = await Perfil.findOne({ userId, nombre: perfilName });
    if (!perfil) {
      return res.status(404).json({ message: "Perfil no encontrado" });
    }

    const isMatch = await bcrypt.compare(perfilPass, perfil.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Contraseña de perfil inválida" });
    }

    res.json({ message: "Perfil validado correctamente", perfil });
  } catch (error) {
    console.error("Error en loginPerfil:", error);
    handleMongooseError(res, error);
  }
};

/**
 * 📌 Editar un perfil existente
 */
export const editarPerfil = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id, nombre, password, permisos } = req.body;

    const perfil = await Perfil.findOne({ _id: id, userId });
    if (!perfil) return res.status(404).json({ message: "Perfil no encontrado" });

    if (nombre !== undefined) perfil.nombre = nombre;
    if (password !== undefined) {
      perfil.password = await bcrypt.hash(password, 10);
    }
    if (permisos !== undefined) perfil.permisos = permisos;

    await perfil.save();
    res.json({ message: "Perfil actualizado", perfil });
  } catch (error) {
    console.error("Error al editar perfil:", error);
    handleMongooseError(res, error);
  }
};

/**
 * 📌 Eliminar un perfil
 */
export const eliminarPerfil = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const perfil = await Perfil.findOne({ _id: id, userId });
    if (!perfil) return res.status(404).json({ message: "Perfil no encontrado" });

    await perfil.remove();
    res.json({ message: "Perfil eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar perfil:", error);
    handleMongooseError(res, error);
  }
};

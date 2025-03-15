// controllers/perfilController.js
import Perfil from "../models/perfil.js";
import User from "../models/user.js";

// Listar Perfiles => si no hay, crea "admin"/"1234"
export const listarPerfiles = async (req, res) => {
  try {
    const userId = req.user.id;
    let perfiles = await Perfil.find({ userId });
    if (!perfiles || perfiles.length === 0) {
      const adminPerfil = new Perfil({
        nombre: "admin",
        password: "1234",
        userId,
        permisos: {
          dashboard: true,
          obras: true,
          clientes: true,
          presupuestos: true,
          proveedores: true,
          contabilidad: true,
          reportes: true,
          nomina: true,
          admin: true
        }
      });
      await adminPerfil.save();
      perfiles = [adminPerfil];
    }
    res.json(perfiles);
  } catch (error) {
    console.error("Error al listar perfiles:", error);
    res
      .status(500)
      .json({ message: "Error al listar perfiles", error: error.message });
  }
};

// Crear Perfil => verifica límite
export const crearPerfil = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    // Ver cuántos perfiles tiene
    const count = await Perfil.countDocuments({ userId });
    if (count >= user.cantidadUsuarios) {
      return res.status(403).json({
        message: `Has alcanzado el máximo de perfiles (${user.cantidadUsuarios}).`
      });
    }

    const { nombre, password, permisos } = req.body;
    const nuevoPerfil = new Perfil({
      nombre,
      password,
      permisos: permisos || {},
      userId
    });
    await nuevoPerfil.save();
    res.status(201).json(nuevoPerfil);
  } catch (error) {
    console.error("Error al crear perfil:", error);
    res.status(500).json({ message: "Error al crear perfil", error: error.message });
  }
};

// Login de Perfil (2do login)
export const loginPerfil = async (req, res) => {
  try {
    const userId = req.user.id;
    const { perfilName, perfilPass } = req.body;
    const perfil = await Perfil.findOne({ userId, nombre: perfilName });
    if (!perfil) {
      return res.status(404).json({ message: "Perfil no encontrado" });
    }
    if (perfil.password !== perfilPass) {
      return res.status(401).json({ message: "Contraseña de perfil inválida" });
    }
    res.json({ message: "Perfil validado", perfil });
  } catch (error) {
    console.error("Error en loginPerfil:", error);
    res.status(500).json({ message: "Error al loguear perfil", error: error.message });
  }
};

// Editar Perfil
export const editarPerfil = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id, nombre, password, permisos } = req.body;

    const perfil = await Perfil.findOne({ _id: id, userId });
    if (!perfil) return res.status(404).json({ message: "Perfil no encontrado" });

    if (nombre !== undefined) perfil.nombre = nombre;
    if (password !== undefined) perfil.password = password;
    if (permisos !== undefined) perfil.permisos = permisos;
    await perfil.save();

    res.json({ message: "Perfil actualizado", perfil });
  } catch (error) {
    console.error("Error al editar perfil:", error);
    res.status(500).json({ message: "Error al editar perfil", error: error.message });
  }
};

// Eliminar Perfil
export const eliminarPerfil = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const perfil = await Perfil.findOne({ _id: id, userId });
    if (!perfil) return res.status(404).json({ message: "Perfil no encontrado" });

    await perfil.remove();
    res.json({ message: "Perfil eliminado" });
  } catch (error) {
    console.error("Error al eliminar perfil:", error);
    res.status(500).json({ message: "Error al eliminar", error: error.message });
  }
};

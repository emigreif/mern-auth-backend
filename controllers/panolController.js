import Panol from "../models/Panol.js";

// 📌 Obtener el estado del pañol del usuario (o crearlo si no existe)
export const obtenerPanol = async (req, res) => {
  try {
    let panol = await Panol.findOne({ user: req.user.id });

    if (!panol) {
      panol = new Panol({ user: req.user.id });
      await panol.save();
    }

    res.json(panol);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el pañol", error: error.message });
  }
};

// 📌 Agregar un nuevo accesorio al pañol
export const agregarAccesorio = async (req, res) => {
  try {
    const { codigo, descripcion, color, cantidad, marca } = req.body;

    if (!codigo || !descripcion || !color || cantidad == null || !marca) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    let panol = await Panol.findOne({ user: req.user.id });

    if (!panol) {
      panol = new Panol({ user: req.user.id });
    }

    // Verificar si el accesorio ya existe para actualizar la cantidad
    const accesorioExistente = panol.accesorios.find(a => a.codigo === codigo);
    
    if (accesorioExistente) {
      accesorioExistente.cantidad += cantidad;
    } else {
      panol.accesorios.push({ codigo, descripcion, color, cantidad, marca });
    }

    await panol.save();
    res.status(201).json(panol.accesorios);
  } catch (error) {
    res.status(400).json({ message: "Error al agregar accesorio", error: error.message });
  }
};

// 📌 Eliminar un accesorio por ID
export const eliminarAccesorio = async (req, res) => {
  try {
    let panol = await Panol.findOne({ user: req.user.id });

    if (!panol) return res.status(404).json({ message: "Pañol no encontrado" });

    panol.accesorios = panol.accesorios.filter(a => a._id.toString() !== req.params.id);

    await panol.save();
    res.json({ message: "Accesorio eliminado" });
  } catch (error) {
    res.status(400).json({ message: "Error al eliminar accesorio", error: error.message });
  }
};

// 📌 Agregar una herramienta
export const agregarHerramienta = async (req, res) => {
  try {
    const { descripcion, marca, modelo, identificacion, estado } = req.body;

    if (!descripcion || !marca || !modelo || !identificacion) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    let panol = await Panol.findOne({ user: req.user.id });

    if (!panol) panol = new Panol({ user: req.user.id });

    panol.herramientas.push({ descripcion, marca, modelo, identificacion, estado });

    await panol.save();
    res.status(201).json(panol.herramientas);
  } catch (error) {
    res.status(400).json({ message: "Error al agregar herramienta", error: error.message });
  }
};

// 📌 Eliminar herramienta por ID
export const eliminarHerramienta = async (req, res) => {
  try {
    let panol = await Panol.findOne({ user: req.user.id });

    if (!panol) return res.status(404).json({ message: "Pañol no encontrado" });

    panol.herramientas = panol.herramientas.filter(h => h._id.toString() !== req.params.id);

    await panol.save();
    res.json({ message: "Herramienta eliminada" });
  } catch (error) {
    res.status(400).json({ message: "Error al eliminar herramienta", error: error.message });
  }
};

// 📌 Agregar un perfil
export const agregarPerfil = async (req, res) => {
  try {
    const { codigo, cantidad, descripcion, largo, color } = req.body;

    if (!codigo || cantidad == null || !descripcion || !largo || !color) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    let panol = await Panol.findOne({ user: req.user.id });

    if (!panol) panol = new Panol({ user: req.user.id });

    panol.perfiles.push({ codigo, cantidad, descripcion, largo, color });

    await panol.save();
    res.status(201).json(panol.perfiles);
  } catch (error) {
    res.status(400).json({ message: "Error al agregar perfil", error: error.message });
  }
};

// 📌 Eliminar un perfil por ID
export const eliminarPerfil = async (req, res) => {
  try {
    let panol = await Panol.findOne({ user: req.user.id });

    if (!panol) return res.status(404).json({ message: "Pañol no encontrado" });

    panol.perfiles = panol.perfiles.filter(p => p._id.toString() !== req.params.id);

    await panol.save();
    res.json({ message: "Perfil eliminado" });
  } catch (error) {
    res.status(400).json({ message: "Error al eliminar perfil", error: error.message });
  }
};

// 📌 Agregar un vidrio
export const agregarVidrio = async (req, res) => {
  try {
    const { codigo, descripcion, cantidad, ancho, alto } = req.body;

    if (!codigo || cantidad == null || !descripcion || !ancho || !alto) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    let panol = await Panol.findOne({ user: req.user.id });

    if (!panol) panol = new Panol({ user: req.user.id });

    panol.vidrios.push({ codigo, descripcion, cantidad, ancho, alto });

    await panol.save();
    res.status(201).json(panol.vidrios);
  } catch (error) {
    res.status(400).json({ message: "Error al agregar vidrio", error: error.message });
  }
};

// 📌 Eliminar un vidrio por ID
export const eliminarVidrio = async (req, res) => {
  try {
    let panol = await Panol.findOne({ user: req.user.id });

    if (!panol) return res.status(404).json({ message: "Pañol no encontrado" });

    panol.vidrios = panol.vidrios.filter(v => v._id.toString() !== req.params.id);

    await panol.save();
    res.json({ message: "Vidrio eliminado" });
  } catch (error) {
    res.status(400).json({ message: "Error al eliminar vidrio", error: error.message });
  }
};
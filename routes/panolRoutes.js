import Panol from "../models/panol.js";

/**
 * 📌 Obtener el estado del pañol
 */
export const obtenerPanol = async (req, res) => {
  try {
    let panol = await Panol.findOne({ user: req.user.id }).populate("herramientas.obra herramientas.responsable");
    if (!panol) {
      panol = new Panol({ user: req.user.id });
      await panol.save();
    }
    res.json(panol);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el pañol", error: error.message });
  }
};

/** ===========================
 * 📌 MÉTODOS PARA HERRAMIENTAS
 * ===========================*/

/**
 * Agregar una nueva herramienta
 */
export const agregarHerramienta = async (req, res) => {
  try {
    const { marca, modelo, descripcion, numeroSerie, estado, obra, responsable } = req.body;

    if (!marca || !modelo || !descripcion || !numeroSerie) {
      return res.status(400).json({ message: "Todos los campos son requeridos." });
    }

    let panol = await Panol.findOne({ user: req.user.id });
    if (!panol) panol = new Panol({ user: req.user.id });

    const nuevaHerramienta = { marca, modelo, descripcion, numeroSerie, estado, obra, responsable };
    panol.herramientas.push(nuevaHerramienta);
    await panol.save();

    res.status(201).json(nuevaHerramienta);
  } catch (error) {
    res.status(400).json({ message: "Error al agregar herramienta", error: error.message });
  }
};

/**
 * Modificar estado de herramienta
 */
export const modificarHerramienta = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, obra, responsable } = req.body;

    let panol = await Panol.findOne({ user: req.user.id });
    if (!panol) return res.status(404).json({ message: "Pañol no encontrado" });

    let herramienta = panol.herramientas.id(id);
    if (!herramienta) return res.status(404).json({ message: "Herramienta no encontrada" });

    herramienta.estado = estado;
    herramienta.obra = estado === "en obra" ? obra : null;
    herramienta.responsable = estado === "en obra" ? responsable : null;

    await panol.save();
    res.json(herramienta);
  } catch (error) {
    res.status(400).json({ message: "Error al modificar herramienta", error: error.message });
  }
};

/**
 * Eliminar herramienta
 */
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

/** ===========================
 * 📌 MÉTODOS PARA PERFILES
 * ===========================*/

/**
 * Crear un nuevo perfil
 */
export const agregarPerfil = async (req, res) => {
  try {
    const { codigo, cantidad, descripcion, largo, pesoxmetro, color } = req.body;

    let panol = await Panol.findOne({ user: req.user.id });
    if (!panol) panol = new Panol({ user: req.user.id });

    const nuevoPerfil = { codigo, cantidad, descripcion, largo, pesoxmetro, color };
    panol.perfiles.push(nuevoPerfil);

    await panol.save();
    res.status(201).json(nuevoPerfil);
  } catch (error) {
    res.status(400).json({ message: "Error al agregar perfil", error: error.message });
  }
};

/**
 * Modificar perfil
 */
export const modificarPerfil = async (req, res) => {
  try {
    const { id } = req.params;
    const cambios = req.body;

    let panol = await Panol.findOne({ user: req.user.id });
    if (!panol) return res.status(404).json({ message: "Pañol no encontrado" });

    let perfil = panol.perfiles.id(id);
    if (!perfil) return res.status(404).json({ message: "Perfil no encontrado" });

    Object.assign(perfil, cambios);

    await panol.save();
    res.json(perfil);
  } catch (error) {
    res.status(400).json({ message: "Error al modificar perfil", error: error.message });
  }
};

/**
 * Eliminar perfil
 */
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

/** ===========================
 * 📌 MÉTODOS PARA ACCESORIOS
 * ===========================*/

/**
 * Crear un nuevo accesorio
 */
export const agregarAccesorio = async (req, res) => {
  try {
    const { codigo, descripcion, color, cantidad, unidad, tipo } = req.body;

    let panol = await Panol.findOne({ user: req.user.id });
    if (!panol) panol = new Panol({ user: req.user.id });

    const nuevoAccesorio = { codigo, descripcion, color, cantidad, unidad, tipo };
    panol.accesorios.push(nuevoAccesorio);

    await panol.save();
    res.status(201).json(nuevoAccesorio);
  } catch (error) {
    res.status(400).json({ message: "Error al agregar accesorio", error: error.message });
  }
};

/**
 * Modificar accesorio
 */
export const modificarAccesorio = async (req, res) => {
  try {
    const { id } = req.params;
    const cambios = req.body;

    let panol = await Panol.findOne({ user: req.user.id });
    if (!panol) return res.status(404).json({ message: "Pañol no encontrado" });

    let accesorio = panol.accesorios.id(id);
    if (!accesorio) return res.status(404).json({ message: "Accesorio no encontrado" });

    Object.assign(accesorio, cambios);

    await panol.save();
    res.json(accesorio);
  } catch (error) {
    res.status(400).json({ message: "Error al modificar accesorio", error: error.message });
  }
};

/**
 * Eliminar accesorio
 */
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
export default router;
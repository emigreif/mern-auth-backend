
import Tipologia from "../models/tipologia.js";
import Ubicacion from "../models/ubicacion.js";

/**
 * ✅ Obtener todas las asociaciones
 */
export const obtenerAsociaciones = async (req, res) => {
  try {
    const asociaciones = await Asociacion.find().populate("tipologias ubicacion");
    res.json(asociaciones);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las asociaciones", error: error.message });
  }
};

/**
 * ✅ Obtener una asociación por ID
 */
export const obtenerAsociacionPorId = async (req, res) => {
  try {
    const asociacion = await Asociacion.findById(req.params.id).populate("tipologias ubicacion");
    if (!asociacion) return res.status(404).json({ message: "Asociación no encontrada" });
    res.json(asociacion);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la asociación", error: error.message });
  }
};

/**
 * ✅ Crear una nueva asociación entre una tipología y una ubicación
 */
export const crearAsociacion = async (req, res) => {
  try {
    const { nombre, tipologias, ubicacion, descripcion } = req.body;

    // Verificar que la ubicación exista
    const existeUbicacion = await Ubicacion.findById(ubicacion);
    if (!existeUbicacion) {
      return res.status(404).json({ message: "Ubicación no encontrada" });
    }

    // Verificar que las tipologías existan
    const tipologiasValidas = await Tipologia.find({ _id: { $in: tipologias } });
    if (tipologiasValidas.length !== tipologias.length) {
      return res.status(400).json({ message: "Algunas tipologías no existen" });
    }

    const nuevaAsociacion = new Asociacion({ nombre, tipologias, ubicacion, descripcion });
    await nuevaAsociacion.save();
    res.status(201).json(nuevaAsociacion);
  } catch (error) {
    res.status(400).json({ message: "Error al crear asociación", error: error.message });
  }
};

/**
 * ✅ Actualizar una asociación existente
 */
export const actualizarAsociacion = async (req, res) => {
  try {
    const asociacion = await Asociacion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!asociacion) return res.status(404).json({ message: "Asociación no encontrada" });
    res.json(asociacion);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la asociación", error: error.message });
  }
};

/**
 * ✅ Eliminar una asociación
 */
export const eliminarAsociacion = async (req, res) => {
  try {
    const asociacion = await Asociacion.findByIdAndDelete(req.params.id);
    if (!asociacion) return res.status(404).json({ message: "Asociación no encontrada" });
    res.json({ message: "Asociación eliminada" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la asociación", error: error.message });
  }
};

/**
 * ✅ Agrupar varias tipologías en una sola
 */
export const agruparTipologias = async (req, res) => {
  try {
    const { nombreGrupo, tipologias } = req.body;

    if (!nombreGrupo || !tipologias || tipologias.length < 2) {
      return res.status(400).json({ message: "Se requieren al menos dos tipologías para agrupar" });
    }

    // Obtener las tipologías y verificar que existan
    const tipologiasValidas = await Tipologia.find({ _id: { $in: tipologias } });
    if (tipologiasValidas.length !== tipologias.length) {
      return res.status(400).json({ message: "Algunas tipologías no existen" });
    }

    // Crear la nueva tipología agrupada
    const nuevaTipologia = new Tipologia({
      nombre: nombreGrupo,
      descripcion: `Agrupación de: ${tipologiasValidas.map(t => t.nombre).join(", ")}`,
    });

    await nuevaTipologia.save();

    res.status(201).json({ message: "Tipologías agrupadas correctamente", nuevaTipologia });
  } catch (error) {
    res.status(500).json({ message: "Error al agrupar tipologías", error: error.message });
  }
};

import Asociacion from "../models/asociacion.js";
import Tipologia from "../models/tipologia.js";
import Ubicacion from "../models/ubicacion.js";
import {
  assertValidId,
  findByIdOrFail,
  handleMongooseError
} from "../utils/validationHelpers.js";

// Crear nueva asociación
export const crearAsociacion = async (req, res) => {
  try {
    const { nombre, tipologias, ubicacion, descripcion } = req.body;

    assertValidId(ubicacion, "Ubicación");
    await findByIdOrFail(Ubicacion, ubicacion, "Ubicación");

    const tipologiasValidas = await Tipologia.find({ _id: { $in: tipologias } });
    if (tipologiasValidas.length !== tipologias.length) {
      return res.status(400).json({ message: "Algunas tipologías no existen" });
    }

    const nuevaAsociacion = new Asociacion({
      nombre,
      tipologias,
      ubicacion,
      descripcion
    });

    await nuevaAsociacion.save();
    res.status(201).json(nuevaAsociacion);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

// Obtener todas las asociaciones
export const obtenerAsociaciones = async (req, res) => {
  try {
    const asociaciones = await Asociacion.find().populate("tipologias ubicacion");
    res.json(asociaciones);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

// Obtener una asociación por ID
export const obtenerAsociacionPorId = async (req, res) => {
  try {
    assertValidId(req.params.id, "Asociación");
    const asociacion = await Asociacion.findById(req.params.id).populate("tipologias ubicacion");

    if (!asociacion) {
      return res.status(404).json({ message: "Asociación no encontrada" });
    }

    res.json(asociacion);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

// Actualizar una asociación
export const actualizarAsociacion = async (req, res) => {
  try {
    assertValidId(req.params.id, "Asociación");
    const asociacion = await Asociacion.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!asociacion) {
      return res.status(404).json({ message: "Asociación no encontrada" });
    }

    res.json(asociacion);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

// Eliminar una asociación
export const eliminarAsociacion = async (req, res) => {
  try {
    assertValidId(req.params.id, "Asociación");
    const asociacion = await Asociacion.findByIdAndDelete(req.params.id);

    if (!asociacion) {
      return res.status(404).json({ message: "Asociación no encontrada" });
    }

    res.json({ message: "Asociación eliminada" });
  } catch (error) {
    handleMongooseError(res, error);
  }
};

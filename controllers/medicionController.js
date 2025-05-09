import Medicion from "../models/medicion.js";
import Obra from "../models/obra.js";
import Tipologia from "../models/tipologia.js";
import Ubicacion from "../models/ubicacion.js";
import {
  assertValidId,
  handleMongooseError
} from "../utils/validationHelpers.js";

// Obtener todas las mediciones
export const obtenerMediciones = async (req, res) => {
  try {
    const mediciones = await Medicion.find()
      .populate("usuario", "nombre email")
      .populate("obra", "nombre codigoObra")
      .populate("ubicacion", "nombre")
      .populate("tipologia", "nombre");

    res.json(mediciones);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

// Obtener una medición por ID
export const obtenerMedicionPorId = async (req, res) => {
  try {
    const { id } = req.params;
    assertValidId(id, "Medición");

    const medicion = await Medicion.findById(id)
      .populate("usuario", "nombre email")
      .populate("obra", "nombre codigoObra")
      .populate("ubicacion", "nombre")
      .populate("tipologia", "nombre");

    if (!medicion) {
      return res.status(404).json({ message: "Medición no encontrada" });
    }

    res.json(medicion);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

// Crear nueva medición
export const crearMedicion = async (req, res) => {
  try {
    const { obra, ubicacion, tipologia, ancho, alto, cantidad, observaciones } = req.body;

    if (!obra || !ubicacion || !tipologia || !ancho || !alto || !cantidad) {
      return res.status(400).json({ message: "Todos los campos son requeridos" });
    }

    const nuevaMedicion = new Medicion({
      usuario: req.user.id,
      obra,
      ubicacion,
      tipologia,
      ancho,
      alto,
      cantidad,
      observaciones
    });

    await nuevaMedicion.save();
    res.status(201).json(nuevaMedicion);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

// Actualizar una medición por ID
export const actualizarMedicion = async (req, res) => {
  try {
    const { id } = req.params;
    assertValidId(id, "Medición");

    const medicion = await Medicion.findById(id);
    if (!medicion) {
      return res.status(404).json({ message: "Medición no encontrada" });
    }

    Object.assign(medicion, req.body);
    await medicion.save();

    res.json(medicion);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

// Eliminar una medición por ID
export const eliminarMedicion = async (req, res) => {
  try {
    const { id } = req.params;
    assertValidId(id, "Medición");

    const medicion = await Medicion.findByIdAndDelete(id);
    if (!medicion) {
      return res.status(404).json({ message: "Medición no encontrada" });
    }

    res.json({ message: "Medición eliminada correctamente" });
  } catch (error) {
    handleMongooseError(res, error);
  }
};

// Generar reporte de mediciones
export const generarReporteMediciones = async (req, res) => {
  try {
    const reporte = await Medicion.aggregate([
      {
        $group: {
          _id: { tipologia: "$tipologia", ubicacion: "$ubicacion" },
          totalCantidad: { $sum: "$cantidad" }
        }
      },
      {
        $lookup: {
          from: "tipologias",
          localField: "_id.tipologia",
          foreignField: "_id",
          as: "tipologia"
        }
      },
      {
        $lookup: {
          from: "ubicacions",
          localField: "_id.ubicacion",
          foreignField: "_id",
          as: "ubicacion"
        }
      },
      { $unwind: "$tipologia" },
      { $unwind: "$ubicacion" },
      {
        $project: {
          _id: 0,
          tipologia: "$tipologia.nombre",
          ubicacion: "$ubicacion.nombre",
          totalCantidad: 1
        }
      }
    ]);

    res.json(reporte);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

import Medicion from "../models/medicion.js";
import Asociacion from "../models/asociacion.js";

/**
 * ✅ Obtener todas las mediciones
 */
export const obtenerMediciones = async (req, res) => {
  try {
    const mediciones = await Medicion.find().populate("asociacion");
    res.json(mediciones);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las mediciones", error: error.message });
  }
};

/**
 * ✅ Obtener una medición por ID
 */
export const obtenerMedicionPorId = async (req, res) => {
  try {
    const medicion = await Medicion.findById(req.params.id).populate("asociacion");
    if (!medicion) return res.status(404).json({ message: "Medición no encontrada" });
    res.json(medicion);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la medición", error: error.message });
  }
};

/**
 * ✅ Crear una nueva medición
 */
export const crearMedicion = async (req, res) => {
  try {
    const { asociacion, dimensiones, cantidad, observaciones } = req.body;

    // Verificar que la asociación exista
    const existeAsociacion = await Asociacion.findById(asociacion);
    if (!existeAsociacion) {
      return res.status(404).json({ message: "Asociación no encontrada" });
    }

    const nuevaMedicion = new Medicion({ asociacion, dimensiones, cantidad, observaciones });
    await nuevaMedicion.save();

    res.status(201).json(nuevaMedicion);
  } catch (error) {
    res.status(400).json({ message: "Error al crear medición", error: error.message });
  }
};

/**
 * ✅ Actualizar una medición existente
 */
export const actualizarMedicion = async (req, res) => {
  try {
    const medicion = await Medicion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!medicion) return res.status(404).json({ message: "Medición no encontrada" });
    res.json(medicion);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la medición", error: error.message });
  }
};

/**
 * ✅ Eliminar una medición
 */
export const eliminarMedicion = async (req, res) => {
  try {
    const medicion = await Medicion.findByIdAndDelete(req.params.id);
    if (!medicion) return res.status(404).json({ message: "Medición no encontrada" });
    res.json({ message: "Medición eliminada" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la medición", error: error.message });
  }
};

/**
 * ✅ Generar un reporte de mediciones
 * 🔹 Restará la lista de todas las mediciones obtenidas en la base de datos
 */
export const generarReporteMediciones = async (req, res) => {
  try {
    const mediciones = await Medicion.find().populate("asociacion");

    if (mediciones.length === 0) {
      return res.status(404).json({ message: "No hay mediciones registradas" });
    }

    // Agrupar por asociación y sumar las cantidades
    const reporte = mediciones.reduce((acc, medicion) => {
      const key = medicion.asociacion ? medicion.asociacion.nombre : "Sin asociación";
      if (!acc[key]) {
        acc[key] = {
          asociacion: key,
          totalCantidad: 0,
          detalles: []
        };
      }
      acc[key].totalCantidad += medicion.cantidad;
      acc[key].detalles.push({
        dimensiones: medicion.dimensiones,
        cantidad: medicion.cantidad,
        observaciones: medicion.observaciones
      });
      return acc;
    }, {});

    res.json(Object.values(reporte));
  } catch (error) {
    res.status(500).json({ message: "Error al generar el reporte de mediciones", error: error.message });
  }
};

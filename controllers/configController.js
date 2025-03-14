// backend/controllers/configController.js
import Config from "../models/Config.js";

/**
 * Obtener la configuración del usuario autenticado.
 * Si no existe, se crea una configuración por defecto.
 */
export const obtenerConfiguracion = async (req, res) => {
  try {
    let config = await Config.findOne({ user: req.user.id });
    if (!config) {
      // Crear configuración con valores predeterminados
      config = new Config({ user: req.user.id });
      await config.save();
    }
    res.json(config);
  } catch (error) {
    console.error("Error al obtener configuración:", error);
    res.status(500).json({ message: "Error al obtener configuración", error: error.message });
  }
};

/**
 * Actualizar la configuración del usuario.
 * Se reemplazan los arrays de impuestos e índices.
 */
export const actualizarConfiguracion = async (req, res) => {
  try {
    const { impuestos, indicesActualizacion } = req.body;
    let config = await Config.findOne({ user: req.user.id });
    if (!config) {
      config = new Config({ user: req.user.id });
    }
    if (impuestos) config.impuestos = impuestos;
    if (indicesActualizacion) config.indicesActualizacion = indicesActualizacion;
    await config.save();
    res.json(config);
  } catch (error) {
    console.error("Error al actualizar configuración:", error);
    res.status(500).json({ message: "Error al actualizar configuración", error: error.message });
  }
};

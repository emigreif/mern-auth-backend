import Config from "../models/config.js";
import { handleMongooseError } from "../utils/validationHelpers.js";

// Obtener configuración del usuario (o crear por defecto)
export const obtenerConfiguracion = async (req, res) => {
  try {
    let config = await Config.findOne({ user: req.user.id });
    if (!config) {
      config = new Config({ user: req.user.id });
      await config.save();
    }
    res.json(config);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

// Actualizar configuración del usuario
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
    handleMongooseError(res, error);
  }
};

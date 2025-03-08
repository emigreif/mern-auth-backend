import Config from "../models/Config.js";

// 🔹 Obtener la configuración del usuario autenticado
export const obtenerConfiguracion = async (req, res) => {
  try {
    let config = await Config.findOne({ user: req.user.id });

    if (!config) {
      // Si no existe configuración, se devuelve una por defecto
      config = new Config({
        user: req.user.id,
        roles: ["Administrador", "Producción", "Ventas"],
        impuestos: [],
        indicesSaldo: 1.05,
        costoHora: 2000,
      });
      await config.save();
    }

    res.json(config);
  } catch (error) {
    console.error("Error al obtener configuración:", error);
    res.status(500).json({ message: "Error al obtener configuración", error: error.message });
  }
};

// 🔹 Actualizar la configuración del usuario autenticado
export const actualizarConfiguracion = async (req, res) => {
  try {
    let config = await Config.findOne({ user: req.user.id });

    if (!config) {
      // Si no existe, se crea una nueva configuración
      config = new Config({ user: req.user.id });
    }

    // Actualizar solo los campos enviados en la petición
    if (req.body.roles) {
      config.roles = req.body.roles;
    }
    if (req.body.impuestos) {
      config.impuestos = req.body.impuestos;
    }
    if (req.body.indicesSaldo) {
      config.indicesSaldo = req.body.indicesSaldo;
    }
    if (req.body.costoHora) {
      config.costoHora = req.body.costoHora;
    }

    await config.save();
    res.json({ message: "Configuración actualizada correctamente", config });
  } catch (error) {
    console.error("Error al actualizar configuración:", error);
    res.status(500).json({ message: "Error al actualizar configuración", error: error.message });
  }
};

// backend/routes/configRoutes.js
import express from 'express';
import Config from '../models/Config.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET: Obtener la config del usuario
router.get('/', protect, async (req, res) => {
  try {
    // Buscar la config asociada al usuario logueado
    let config = await Config.findOne({ user: req.user.id });
    
    // Si no existe, podríamos crear una "por defecto" o devolver algo vacío
    if (!config) {
      // Aquí devolvemos un objeto "por defecto", o podrías crear uno en la BD
      return res.json({
        user: req.user.id,
        roles: ["Administrador", "Producción", "Ventas"],
        impuestos: [],
        indicesSaldo: 1.05,
        costoHora: 2000,
        // ...
      });
    }

    res.json(config);
  } catch (error) {
    console.error("Error al obtener la configuración:", error);
    res.status(500).json({ message: "Error al obtener la configuración" });
  }
});

// PUT: Actualizar la config del usuario
router.put('/', protect, async (req, res) => {
  try {
    let config = await Config.findOne({ user: req.user.id });

    if (!config) {
      config = new Config({ user: req.user.id });
    }
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
    // ... Repite con el resto de campos que quieras guardar

    await config.save();
    res.json({ message: "Configuración guardada con éxito!", config });
  } catch (error) {
    console.error("Error al actualizar la configuración:", error);
    res.status(500).json({ message: "Error al actualizar la configuración" });
  }
});

export default router;

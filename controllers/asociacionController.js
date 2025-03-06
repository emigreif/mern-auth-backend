// backend/controllers/asociacionController.js
import Ubicacion from '../models/Ubicacion.js';

export const asociarTipologias = async (req, res) => {
  try {
    const { ubicacionId, tipologiaIds } = req.body;
    if (!ubicacionId || !tipologiaIds || !Array.isArray(tipologiaIds)) {
      return res.status(400).json({ message: 'Se requiere "ubicacionId" y "tipologiaIds" (arreglo).' });
    }

    // Buscar la ubicación que corresponde al usuario autenticado
    const ubicacion = await Ubicacion.findOne({ _id: ubicacionId, user: req.user.id });
    if (!ubicacion) {
      return res.status(404).json({ message: 'Ubicación no encontrada o no pertenece al usuario.' });
    }

    // Actualizamos el campo "tipologias" de la ubicación
    ubicacion.tipologias = tipologiaIds;
    await ubicacion.save();

    res.json({ message: 'Tipologías asociadas correctamente.', ubicacion });
  } catch (error) {
    res.status(500).json({ message: 'Error al asociar tipologías', error: error.message });
  }
};

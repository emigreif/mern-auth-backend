// // backend/controllers/asociacionController.js
// import Ubicacion from "../models/ubicacion.js";

// /**
//  * Ejemplo: Asignar una o varias tipologías a una ubicación
//  * body = { ubicacionId, tipologiaIds }
//  */
// export const asignarTipologiasAUbicacion = async (req, res) => {
//   try {
//     const { ubicacionId, tipologiaIds } = req.body;
//     if (!ubicacionId || !tipologiaIds || !Array.isArray(tipologiaIds)) {
//       return res.status(400).json({ message: "Datos incompletos" });
//     }

//     const ubicacion = await Ubicacion.findOne({ _id: ubicacionId, user: req.user.id });
//     if (!ubicacion) {
//       return res.status(404).json({ message: "Ubicación no encontrada" });
//     }

//     // Insertar sin duplicar
//     tipologiaIds.forEach(tid => {
//       if (!ubicacion.tipologias.includes(tid)) {
//         ubicacion.tipologias.push(tid);
//       }
//     });
//     await ubicacion.save();

//     res.json({ message: "Tipologías asignadas", ubicacion });
//   } catch (error) {
//     res.status(500).json({ message: "Error al asignar tipologías", error: error.message });
//   }
// };

// /**
//  * Ejemplo: Eliminar una tipología de una ubicación
//  */
// export const eliminarTipologiaDeUbicacion = async (req, res) => {
//   try {
//     const { ubicacionId, tipologiaId } = req.params;
//     const ubicacion = await Ubicacion.findOne({ _id: ubicacionId, user: req.user.id });
//     if (!ubicacion) {
//       return res.status(404).json({ message: "Ubicación no encontrada" });
//     }

//     ubicacion.tipologias = ubicacion.tipologias.filter(t => t.toString() !== tipologiaId);
//     await ubicacion.save();

//     res.json({ message: "Tipología removida de la ubicación", ubicacion });
//   } catch (error) {
//     res.status(500).json({ message: "Error al eliminar tipología", error: error.message });
//   }
// };
// controllers/asociacionController.js
import Ubicacion from "../models/ubicacion.js";

/**
 * Asignar una o varias tipologías a una ubicación
 * body = { ubicacionId, tipologiaIds }
 */
export const asignarTipologiasAUbicacion = async (req, res) => {
  try {
    const { ubicacionId, tipologiaIds } = req.body;
    if (!ubicacionId || !tipologiaIds || !Array.isArray(tipologiaIds)) {
      return res.status(400).json({ message: "Datos incompletos" });
    }

    const ubicacion = await Ubicacion.findOne({
      _id: ubicacionId,
      user: req.user.id
    });
    if (!ubicacion) {
      return res.status(404).json({ message: "Ubicación no encontrada" });
    }

    // Insertar sin duplicar
    tipologiaIds.forEach((tid) => {
      if (!ubicacion.tipologias.includes(tid)) {
        ubicacion.tipologias.push(tid);
      }
    });
    await ubicacion.save();

    res.json({ message: "Tipologías asignadas", ubicacion });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al asignar tipologías", error: error.message });
  }
};

/**
 * Eliminar una tipología de una ubicación
 * Params => :ubicacionId, :tipologiaId
 */
export const eliminarTipologiaDeUbicacion = async (req, res) => {
  try {
    const { ubicacionId, tipologiaId } = req.params;
    const ubicacion = await Ubicacion.findOne({
      _id: ubicacionId,
      user: req.user.id
    });
    if (!ubicacion) {
      return res.status(404).json({ message: "Ubicación no encontrada" });
    }

    ubicacion.tipologias = ubicacion.tipologias.filter(
      (t) => t.toString() !== tipologiaId
    );
    await ubicacion.save();

    res.json({ message: "Tipología removida de la ubicación", ubicacion });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar tipología",
      error: error.message
    });
  }
};

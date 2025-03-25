import Tipologia from "../models/tipologia.js";


/**
 * Obtener todas las tipologías del usuario
 */
export const obtenerTipologias = async (req, res) => {
  try {
    const tipologias = await Tipologia.find({ user: req.user.id }).populate("obra");
    res.json(tipologias);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener tipologías", error: error.message });
  }
}

// 🟢 Crear tipología manual
export const crearTipologia = async (req, res) => {
  try {
    const { tipo, descripcion, base, altura, cantidad, obra } = req.body;

    if (!tipo || !base || !altura || !obra) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const nueva = new Tipologia({
      tipo,
      descripcion,
      base,
      altura,
      cantidad,
      obra,
      user: req.user.id
    });

    await nueva.save();
    res.status(201).json(nueva);
  } catch (err) {
    res.status(500).json({ message: "Error al crear tipología", error: err.message });
  }
};

// 🟡 Modificar tipología
export const modificarTipologia = async (req, res) => {
  try {
    const { id } = req.params;
    const cambios = req.body;

    const tipologia = await Tipologia.findById(id);
    if (!tipologia) return res.status(404).json({ message: "Tipología no encontrada" });

    Object.assign(tipologia, cambios);
    await tipologia.save();
    res.json(tipologia);
  } catch (err) {
    res.status(500).json({ message: "Error al modificar", error: err.message });
  }
};

// 🔴 Eliminar tipología
export const eliminarTipologia = async (req, res) => {
  try {
    const { id } = req.params;
    await Tipologia.findByIdAndDelete(id);
    res.json({ message: "Tipología eliminada" });
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar", error: err.message });
  }
};
export const agruparTipologias = async (req, res) => {
  try {
    const { tipo, descripcion, base, altura, origenes, obra } = req.body;

    if (!tipo || !base || !altura || !obra || !Array.isArray(origenes) || origenes.length < 2) {
      return res.status(400).json({ message: "Datos insuficientes para agrupar" });
    }

    // Obtener las tipologías a agrupar
    const tipologias = await Tipologia.find({ _id: { $in: origenes }, obra });

    if (tipologias.length !== origenes.length) {
      return res.status(404).json({ message: "Algunas tipologías no fueron encontradas" });
    }

    const tipoBase = tipologias[0].tipo;
    const cantidadBase = tipologias[0].cantidad;

    const mismas = tipologias.every(
      (t) => t.tipo === tipoBase && t.cantidad === cantidadBase
    );

    if (!mismas) {
      return res.status(400).json({ message: "Las tipologías deben tener el mismo tipo y cantidad" });
    }

    // Concatenar descripciones
    const desc = tipologias.map(t => t.descripcion).join(" / ");

    // Crear nueva tipología
    const nueva = new Tipologia({
      tipo,
      descripcion: descripcion || desc,
      base,
      altura,
      cantidad: cantidadBase,
      obra,
      user: req.user.id
    });

    await nueva.save();

    // Eliminar las originales
    await Tipologia.deleteMany({ _id: { $in: origenes } });

    res.status(201).json(nueva);
  } catch (error) {
    res.status(500).json({ message: "Error al agrupar tipologías", error: error.message });
  }
};

export const importarTipologiasDesdeExcel = async (req, res) => {
  try {
    const { tipologias } = req.body;
    const userId = req.user.id;

    if (!Array.isArray(tipologias) || tipologias.length === 0) {
      return res.status(400).json({ message: "No se recibieron tipologías" });
    }

    const tipologiasFormateadas = tipologias.map((t) => ({
      tipo: t.tipo,
      descripcion: t.descripcion || "",
      base: t.base,
      altura: t.altura,
      cantidad: t.cantidad || 1,
      obra: t.obra,
      user: userId,
    }));

    const creadas = await Tipologia.insertMany(tipologiasFormateadas);
    res.status(201).json({ message: "Tipologías importadas", total: creadas.length });
  } catch (error) {
    console.error("Error al importar tipologías:", error);
    res.status(500).json({ message: "Error al importar tipologías", error: error.message });
  }
};

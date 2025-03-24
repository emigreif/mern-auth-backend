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

// 🟣 Agrupar tipologías
export const agruparTipologias = async (req, res) => {
  try {
    const { ids, nuevaBase, nuevaAltura } = req.body;

    if (!ids || ids.length < 2) return res.status(400).json({ message: "Se requieren al menos 2 tipologías" });

    const tipologias = await Tipologia.find({ _id: { $in: ids } });

    const tipoUnico = tipologias[0].tipo;
    const cantidadesIguales = tipologias.every(t => t.tipo === tipoUnico && t.cantidad === tipologias[0].cantidad);

    if (!cantidadesIguales) {
      return res.status(400).json({ message: "Las tipologías deben tener el mismo tipo y cantidad" });
    }

    const descripcionConcat = tipologias.map(t => t.descripcion).join(" / ");

    const nuevaTipologia = new Tipologia({
      tipo: tipoUnico,
      descripcion: descripcionConcat,
      base: nuevaBase,
      altura: nuevaAltura,
      cantidad: tipologias[0].cantidad,
      obra: tipologias[0].obra,
      user: tipologias[0].user
    });

    await nuevaTipologia.save();

    await Tipologia.deleteMany({ _id: { $in: ids } });

    res.status(201).json(nuevaTipologia);
  } catch (err) {
    res.status(500).json({ message: "Error al agrupar", error: err.message });
  }
};

// 📥 Importar desde Excel (desde fila 11)
// En tipologiaController.js
export const importarTipologiasDesdeExcel = async (req, res) => {
  try {
    const { tipologias } = req.body;
    const userId = req.user.id;

    if (!Array.isArray(tipologias) || tipologias.length === 0) {
      return res.status(400).json({ message: "No se recibieron tipologías" });
    }

    const mapeadas = tipologias.map((t) => ({
      tipo: t.tipo,
      descripcion: t.descripcion,
      base: t.base,
      altura: t.altura,
      cantidad: t.cantidad || 1,
      obra: t.obra, // deberías asegurarte de incluir obra en el frontend
    
    }));
    console.log(req.body) 
    console.log(req.user)

    const creadas = await Tipologia.insertMany(mapeadas);
    res.status(201).json({ message: "Tipologías importadas", total: creadas.length });
  } catch (error) {
    res.status(500).json({ message: "Error al importar", error: error.message });
  }
};

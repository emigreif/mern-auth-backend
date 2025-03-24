import Tipologia from "../models/tipologia.js";
import XLSX from "xlsx";

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
export const importarTipologiasDesdeExcel = async (req, res) => {
  try {
    const archivo = req.file;
    const obraId = req.body.obra;

    if (!archivo) return res.status(400).json({ message: "No se subió el archivo" });
    if (!obraId) return res.status(400).json({ message: "Falta ID de obra" });

    const workbook = XLSX.readFile(archivo.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const json = XLSX.utils.sheet_to_json(sheet, { range: 10 }); // fila 11 = index 10

    const tipologias = json.map(row => ({
      tipo: row["Tipo"]?.toString().trim(),
      cantidad: Number(row["Cant"]) || 1,
      descripcion: row["Descripción"]?.toString().trim() || "",
      base: Number(row["base"]) || 0,
      altura: Number(row["altura"]) || 0,
      obra: obraId,
      user: req.user.id
    })).filter(t => t.tipo && t.base && t.altura);

    const creadas = await Tipologia.insertMany(tipologias);
    res.status(201).json({ message: "Tipologías importadas", creadas });
  } catch (err) {
    res.status(500).json({ message: "Error al importar", error: err.message });
  }
};

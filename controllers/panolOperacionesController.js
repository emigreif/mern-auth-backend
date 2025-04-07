import xlsx from "xlsx";
import { handleMongooseError } from "../utils/validationHelpers.js";

import Perfil from "../models/PanolPerfil.js";
import Vidrio from "../models/PanolVidrio.js";
import Accesorio from "../models/PanolAccesorio.js";
import Herramienta from "../models/PanolHerramienta.js";

// Mapeo de modelos según tipo
const modelMap = {
  perfiles: Perfil,
  vidrios: Vidrio,
  accesorios: Accesorio,
  herramientas: Herramienta,
};

// 📥 Importar desde Excel
export const importarDesdeExcelController = async (req, res) => {
  const { tipo } = req.params;
  const Model = modelMap[tipo];
  if (!Model) return res.status(400).json({ message: "Tipo inválido" });

  try {
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    const user = req.user.id;
    let nuevos = 0;
    let actualizados = 0;
    let errores = [];

    for (const row of data) {
      const doc = { ...row, user };

      try {
        const existente = await Model.findOne({ user, codigo: doc.codigo });
        if (existente) {
          Object.assign(existente, doc);
          await existente.save();
          actualizados++;
        } else {
          await Model.create(doc);
          nuevos++;
        }
      } catch (err) {
        errores.push({ row, error: err.message });
      }
    }

    res.json({ message: "Importación completada", nuevos, actualizados, errores });
  } catch (err) {
    handleMongooseError(res, err);
  }
};

// ➡️ Asignar a obra manual
export const asignarMaterialesController = async (req, res) => {
  const { tipo } = req.params;
  const Model = modelMap[tipo];
  if (!Model) return res.status(400).json({ message: "Tipo inválido" });

  const { obra, items = [] } = req.body;
  if (!obra || !Array.isArray(items)) {
    return res.status(400).json({ message: "Datos inválidos" });
  }

  try {
    const user = req.user.id;
    const asignados = [];
    const faltantes = [];

    for (const item of items) {
      const query = { user, codigo: item.codigo };
      if (item.color) query.color = item.color;

      const doc = await Model.findOne(query);
      if (!doc || doc.cantidad < item.cantidad) {
        faltantes.push({ ...item, stock: doc?.cantidad || 0 });
        continue;
      }

      doc.cantidad -= item.cantidad;
      await doc.save();
      asignados.push(item);
    }

    res.json({ asignados, faltantes });
  } catch (err) {
    handleMongooseError(res, err);
  }
};

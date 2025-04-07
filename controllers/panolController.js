import HerramientaPanol from "../models/PanolHerramienta.js";
import PerfilPanol from "../models/PanolPerfil.js";
import VidrioPanol from "../models/PanolVidrio.js";
import AccesorioPanol from "../models/PanolAccesorio.js";

import {
  assertValidId,
  handleMongooseError
} from "../utils/validationHelpers.js";

/** ======================== 📌 OBTENER TODO ======================== */
export const obtenerPanol = async (req, res) => {
  try {
    const [herramientas, perfiles, accesorios, vidrios] = await Promise.all([
      HerramientaPanol.find({ user: req.user.id }).populate("obra responsable"),
      PerfilPanol.find({ user: req.user.id }),
      AccesorioPanol.find({ user: req.user.id }),
      VidrioPanol.find({ user: req.user.id })
    ]);

    res.json({ herramientas, perfiles, accesorios, vidrios });
  } catch (error) {
    handleMongooseError(res, error);
  }
};

/** ======================== HERRAMIENTAS ======================== */
export const agregarHerramienta = async (req, res) => {
  try {
    const herramienta = new HerramientaPanol({ ...req.body, user: req.user.id });
    await herramienta.save();
    res.status(201).json(herramienta);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

export const modificarHerramienta = async (req, res) => {
  try {
    assertValidId(req.params.id, "Herramienta");
    const herramienta = await HerramientaPanol.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!herramienta) return res.status(404).json({ message: "Herramienta no encontrada" });
    res.json(herramienta);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

export const eliminarHerramienta = async (req, res) => {
  try {
    assertValidId(req.params.id, "Herramienta");
    await HerramientaPanol.deleteOne({ _id: req.params.id, user: req.user.id });
    res.json({ message: "Herramienta eliminada" });
  } catch (error) {
    handleMongooseError(res, error);
  }
};

export const registrarMovimientoHerramienta = async (req, res) => {
  try {
    assertValidId(req.params.id, "Herramienta");
    const { estado, obra, responsable } = req.body;

    const herramienta = await HerramientaPanol.findOne({ _id: req.params.id, user: req.user.id });
    if (!herramienta) return res.status(404).json({ message: "Herramienta no encontrada" });

    herramienta.historial = herramienta.historial || [];
    herramienta.historial.push({
      fecha: new Date(),
      estadoAnterior: herramienta.estado,
      estadoNuevo: estado,
      obra,
      responsable
    });

    herramienta.estado = estado;
    herramienta.obra = estado === "en obra" ? obra : null;
    herramienta.responsable = estado === "en obra" ? responsable : null;

    await herramienta.save();
    res.json({ message: "Movimiento registrado correctamente", herramienta });
  } catch (error) {
    handleMongooseError(res, error);
  }
};

/** ======================== PERFILES ======================== */
export const agregarPerfil = async (req, res) => {
  try {
    const perfil = new PerfilPanol({ ...req.body, user: req.user.id });
    await perfil.save();
    res.status(201).json(perfil);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

export const modificarPerfil = async (req, res) => {
  try {
    assertValidId(req.params.id, "Perfil");
    const perfil = await PerfilPanol.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!perfil) return res.status(404).json({ message: "Perfil no encontrado" });
    res.json(perfil);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

export const eliminarPerfil = async (req, res) => {
  try {
    assertValidId(req.params.id, "Perfil");
    await PerfilPanol.deleteOne({ _id: req.params.id, user: req.user.id });
    res.json({ message: "Perfil eliminado" });
  } catch (error) {
    handleMongooseError(res, error);
  }
};

/** ======================== ACCESORIOS ======================== */
export const agregarAccesorio = async (req, res) => {
  try {
    const accesorio = new AccesorioPanol({ ...req.body, user: req.user.id });
    await accesorio.save();
    res.status(201).json(accesorio);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

export const modificarAccesorio = async (req, res) => {
  try {
    assertValidId(req.params.id, "Accesorio");
    const accesorio = await AccesorioPanol.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!accesorio) return res.status(404).json({ message: "Accesorio no encontrado" });
    res.json(accesorio);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

export const eliminarAccesorio = async (req, res) => {
  try {
    assertValidId(req.params.id, "Accesorio");
    await AccesorioPanol.deleteOne({ _id: req.params.id, user: req.user.id });
    res.json({ message: "Accesorio eliminado" });
  } catch (error) {
    handleMongooseError(res, error);
  }
};

/** ======================== VIDRIOS ======================== */
export const agregarVidrio = async (req, res) => {
  try {
    const vidrio = new VidrioPanol({ ...req.body, user: req.user.id });
    await vidrio.save();
    res.status(201).json(vidrio);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

export const modificarVidrio = async (req, res) => {
  try {
    assertValidId(req.params.id, "Vidrio");
    const vidrio = await VidrioPanol.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!vidrio) return res.status(404).json({ message: "Vidrio no encontrado" });
    res.json(vidrio);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

export const eliminarVidrio = async (req, res) => {
  try {
    assertValidId(req.params.id, "Vidrio");
    await VidrioPanol.deleteOne({ _id: req.params.id, user: req.user.id });
    res.json({ message: "Vidrio eliminado" });
  } catch (error) {
    handleMongooseError(res, error);
  }
};
export const importMateriales = async (req, res) => {
  try {
    const { tipo } = req.params;
    const data = req.body;

    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ message: "No hay datos para importar" });
    }

    const ModelMap = {
      perfiles: PerfilPanol,
      accesorios: AccesorioPanol,
      vidrios: VidrioPanol,
      herramientas: HerramientaPanol
    };

    const Model = ModelMap[tipo];
    if (!Model) return res.status(400).json({ message: "Tipo no válido" });

    const withUser = data.map(d => ({ ...d, user: req.user.id }));
    await Model.insertMany(withUser);

    res.json({ message: "Materiales importados correctamente", cantidad: withUser.length });
  } catch (error) {
    handleMongooseError(res, error);
  }
};
export const asignarPerfilesManual = async (req, res) => {
  try {
    const { obra, items } = req.body;
    if (!obra || !Array.isArray(items)) {
      return res.status(400).json({ message: "Datos inválidos" });
    }

    const perfiles = await PerfilPanol.find({ user: req.user.id });
    const asignados = [];
    const faltantes = [];

    for (const item of items) {
      const perfil = perfiles.find(p => p.codigo === item.codigo && p.color === item.color);
      if (!perfil || perfil.cantidad < item.cantidad) {
        faltantes.push({ ...item, stock: perfil?.cantidad || 0 });
        continue;
      }

      perfil.cantidad -= item.cantidad;
      await perfil.save();
      asignados.push(item);
    }

    res.json({ asignados, faltantes });
  } catch (error) {
    handleMongooseError(res, error);
  }
};
export const asignarPerfilesDesdeExcel = async (req, res) => {
  try {
    const { obra, items } = req.body;
    if (!obra || !Array.isArray(items)) {
      return res.status(400).json({ message: "Datos inválidos" });
    }

    const perfiles = await PerfilPanol.find({ user: req.user.id });
    const asignados = [];
    const faltantes = [];

    for (const raw of items) {
      const codigo = raw.codigo?.trim();
      const color = raw.color?.trim();
      const cantidad = parseFloat(raw.cantidad || 0);

      if (!codigo || !color || cantidad <= 0) {
        faltantes.push({ ...raw, motivo: "Datos inválidos" });
        continue;
      }

      const perfil = perfiles.find(p => p.codigo === codigo && p.color === color);
      if (!perfil || perfil.cantidad < cantidad) {
        faltantes.push({ codigo, color, cantidad, stock: perfil?.cantidad || 0 });
        continue;
      }

      perfil.cantidad -= cantidad;
      await perfil.save();
      asignados.push({ codigo, color, cantidad });
    }

    res.json({ asignados, faltantes });
  } catch (error) {
    handleMongooseError(res, error);
  }
};
export const asignarAccesoriosManual = async (req, res) => {
  try {
    const { obra, items } = req.body;
    if (!obra || !Array.isArray(items)) {
      return res.status(400).json({ message: "Datos inválidos" });
    }

    const accesorios = await AccesorioPanol.find({ user: req.user.id });
    const asignados = [];
    const faltantes = [];

    for (const item of items) {
      const acc = accesorios.find(a => a.codigo === item.codigo && a.color === item.color);
      if (!acc || acc.cantidad < item.cantidad) {
        faltantes.push({ ...item, stock: acc?.cantidad || 0 });
        continue;
      }

      acc.cantidad -= item.cantidad;
      await acc.save();
      asignados.push(item);
    }

    res.json({ asignados, faltantes });
  } catch (error) {
    handleMongooseError(res, error);
  }
};
export const asignarAccesoriosDesdeExcel = async (req, res) => {
  try {
    const { obra, items } = req.body;
    if (!obra || !Array.isArray(items)) {
      return res.status(400).json({ message: "Datos inválidos" });
    }

    const accesorios = await AccesorioPanol.find({ user: req.user.id });
    const asignados = [];
    const faltantes = [];

    for (const raw of items) {
      const codigo = raw.codigo?.trim();
      const color = raw.color?.trim();
      const cantidad = parseFloat(raw.cantidad || 0);

      if (!codigo || !color || cantidad <= 0) {
        faltantes.push({ ...raw, motivo: "Datos inválidos" });
        continue;
      }

      const acc = accesorios.find(a => a.codigo === codigo && a.color === color);
      if (!acc || acc.cantidad < cantidad) {
        faltantes.push({ codigo, color, cantidad, stock: acc?.cantidad || 0 });
        continue;
      }

      acc.cantidad -= cantidad;
      await acc.save();
      asignados.push({ codigo, color, cantidad });
    }

    res.json({ asignados, faltantes });
  } catch (error) {
    handleMongooseError(res, error);
  }
};
export const asignarVidriosManual = async (req, res) => {
  try {
    const { obra, items } = req.body;
    if (!obra || !Array.isArray(items)) {
      return res.status(400).json({ message: "Datos inválidos" });
    }

    const vidrios = await VidrioPanol.find({ user: req.user.id });
    const asignados = [];
    const faltantes = [];

    for (const pedido of items) {
      const candidatos = vidrios
        .filter(v => v.ancho >= pedido.ancho && v.alto >= pedido.alto && v.cantidad > 0)
        .sort((a, b) => (a.ancho * a.alto) - (b.ancho * b.alto));

      const sugerido = candidatos[0];
      if (!sugerido) {
        faltantes.push({ ...pedido, motivo: "No hay vidrio con medidas suficientes" });
        continue;
      }

      sugerido.cantidad -= 1;
      await sugerido.save();
      asignados.push({ ...pedido, asignado: { ancho: sugerido.ancho, alto: sugerido.alto } });
    }

    res.json({ asignados, faltantes });
  } catch (error) {
    handleMongooseError(res, error);
  }
};
export const asignarVidriosDesdeExcel = async (req, res) => {
  try {
    const { obra, items } = req.body;
    if (!obra || !Array.isArray(items)) {
      return res.status(400).json({ message: "Datos inválidos" });
    }

    const vidrios = await VidrioPanol.find({ user: req.user.id });
    const asignados = [];
    const faltantes = [];

    for (const raw of items) {
      const ancho = parseFloat(raw.ancho || 0);
      const alto = parseFloat(raw.alto || 0);

      if (!ancho || !alto || ancho <= 0 || alto <= 0) {
        faltantes.push({ ...raw, motivo: "Medidas inválidas" });
        continue;
      }

      const candidatos = vidrios
        .filter(v => v.ancho >= ancho && v.alto >= alto && v.cantidad > 0)
        .sort((a, b) => (a.ancho * a.alto) - (b.ancho * b.alto));

      const sugerido = candidatos[0];
      if (!sugerido) {
        faltantes.push({ ancho, alto, motivo: "Sin vidrio adecuado" });
        continue;
      }

      sugerido.cantidad -= 1;
      await sugerido.save();
      asignados.push({ ancho, alto, asignado: { ancho: sugerido.ancho, alto: sugerido.alto } });
    }

    res.json({ asignados, faltantes });
  } catch (error) {
    handleMongooseError(res, error);
  }
};
export const asignarHerramienta = async (req, res) => {
  try {
    const { herramienta, obra, responsable } = req.body;
    assertValidId(herramienta, "Herramienta");

    const herramientaObj = await HerramientaPanol.findOne({ _id: herramienta, user: req.user.id });
    if (!herramientaObj) return res.status(404).json({ message: "Herramienta no encontrada" });

    herramientaObj.estado = "en obra";
    herramientaObj.obra = obra;
    herramientaObj.responsable = responsable;

    herramientaObj.historial = herramientaObj.historial || [];
    herramientaObj.historial.push({
      fecha: new Date(),
      estadoAnterior: herramientaObj.estado,
      estadoNuevo: "en obra",
      obra,
      responsable
    });

    await herramientaObj.save();
    res.status(200).json({ message: "Herramienta asignada correctamente", herramienta: herramientaObj });
  } catch (err) {
    console.error("Error al asignar herramienta:", err);
    res.status(500).json({ message: "Error interno", error: err.message });
  }
};

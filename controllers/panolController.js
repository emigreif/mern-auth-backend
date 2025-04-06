import Panol from "../models/panol.js";

import {
  assertValidId,
  handleMongooseError
} from "../utils/validationHelpers.js";

// 🔁 Reutilizable para evitar código repetido
const obtenerPanolUsuario = async (userId, populate = false) => {
  const query = Panol.findOne({ user: userId });
  const panol = populate
    ? await query.populate("herramientas.obra herramientas.responsable")
    : await query;

  if (!panol) {
    const nuevo = new Panol({ user: userId });
    await nuevo.save();
    return nuevo;
  }
  return panol;
};

/** 📌 Obtener el estado del pañol */
export const obtenerPanol = async (req, res) => {
  try {
    const panol = await obtenerPanolUsuario(req.user.id, true);
    res.json(panol);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

/** ======================== HERRAMIENTAS ======================== */
export const agregarHerramienta = async (req, res) => {
  try {
    const { marca, modelo, descripcion, numeroSerie, estado, obra, responsable } = req.body;
    if (!marca || !modelo || !descripcion || !numeroSerie?.trim()) {
      return res.status(400).json({ message: "Todos los campos son requeridos." });
    }

    const panol = await obtenerPanolUsuario(req.user.id);
    const nuevaHerramienta = {
      marca, modelo, descripcion, numeroSerie, estado, obra, responsable,
      historial: [{ fecha: new Date(), estadoNuevo: estado, obra, responsable }]
    };
    panol.herramientas.push(nuevaHerramienta);
    await panol.save();
    res.status(201).json(nuevaHerramienta);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

export const registrarMovimientoHerramienta = async (req, res) => {
  try {
    assertValidId(req.params.id, "Herramienta");
    const { estado, obra, responsable } = req.body;
    const panol = await obtenerPanolUsuario(req.user.id);
    const herramienta = panol.herramientas.id(req.params.id);
    if (!herramienta) return res.status(404).json({ message: "Herramienta no encontrada" });

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

    await panol.save();
    res.json({ message: "Movimiento registrado correctamente", herramienta });
  } catch (error) {
    handleMongooseError(res, error);
  }
};

export const modificarHerramienta = async (req, res) => {
  try {
    assertValidId(req.params.id, "Herramienta");
    const { estado, obra, responsable } = req.body;
    const panol = await obtenerPanolUsuario(req.user.id);
    const herramienta = panol.herramientas.id(req.params.id);
    if (!herramienta) return res.status(404).json({ message: "Herramienta no encontrada" });

    herramienta.estado = estado;
    herramienta.obra = estado === "en obra" ? obra : null;
    herramienta.responsable = estado === "en obra" ? responsable : null;

    await panol.save();
    res.json(herramienta);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

export const eliminarHerramienta = async (req, res) => {
  try {
    assertValidId(req.params.id, "Herramienta");
    const panol = await obtenerPanolUsuario(req.user.id);
    panol.herramientas = panol.herramientas.filter(h => h._id.toString() !== req.params.id);
    await panol.save();
    res.json({ message: "Herramienta eliminada" });
  } catch (error) {
    handleMongooseError(res, error);
  }
};

/** ======================== PERFILES ======================== */
export const agregarPerfil = async (req, res) => {
  try {
    const panol = await obtenerPanolUsuario(req.user.id);
    panol.perfiles.push(req.body);
    await panol.save();
    res.status(201).json(req.body);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

export const modificarPerfil = async (req, res) => {
  try {
    assertValidId(req.params.id, "Perfil");
    const panol = await obtenerPanolUsuario(req.user.id);
    const perfil = panol.perfiles.id(req.params.id);
    if (!perfil) return res.status(404).json({ message: "Perfil no encontrado" });

    Object.assign(perfil, req.body);
    await panol.save();
    res.json(perfil);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

export const eliminarPerfil = async (req, res) => {
  try {
    assertValidId(req.params.id, "Perfil");
    const panol = await obtenerPanolUsuario(req.user.id);
    panol.perfiles = panol.perfiles.filter(p => p._id.toString() !== req.params.id);
    await panol.save();
    res.json({ message: "Perfil eliminado" });
  } catch (error) {
    handleMongooseError(res, error);
  }
};

/** ======================== ACCESORIOS ======================== */
export const agregarAccesorio = async (req, res) => {
  try {
    const panol = await obtenerPanolUsuario(req.user.id);
    panol.accesorios.push(req.body);
    await panol.save();
    res.status(201).json(req.body);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

export const modificarAccesorio = async (req, res) => {
  try {
    assertValidId(req.params.id, "Accesorio");
    const panol = await obtenerPanolUsuario(req.user.id);
    const accesorio = panol.accesorios.id(req.params.id);
    if (!accesorio) return res.status(404).json({ message: "Accesorio no encontrado" });

    Object.assign(accesorio, req.body);
    await panol.save();
    res.json(accesorio);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

export const eliminarAccesorio = async (req, res) => {
  try {
    assertValidId(req.params.id, "Accesorio");
    const panol = await obtenerPanolUsuario(req.user.id);
    panol.accesorios = panol.accesorios.filter(a => a._id.toString() !== req.params.id);
    await panol.save();
    res.json({ message: "Accesorio eliminado" });
  } catch (error) {
    handleMongooseError(res, error);
  }
};

/** ======================== VIDRIOS ======================== */
export const agregarVidrio = async (req, res) => {
  try {
    const { descripcion, cantidad, ancho, alto } = req.body;
    if (!descripcion || cantidad == null || !ancho || !alto) {
      return res.status(400).json({ message: "Todos los campos son requeridos." });
    }

    const panol = await obtenerPanolUsuario(req.user.id);
    panol.vidrios.push(req.body);
    await panol.save();
    res.status(201).json(req.body);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

export const modificarVidrio = async (req, res) => {
  try {
    assertValidId(req.params.id, "Vidrio");
    const panol = await obtenerPanolUsuario(req.user.id);
    const vidrio = panol.vidrios.id(req.params.id);
    if (!vidrio) return res.status(404).json({ message: "Vidrio no encontrado" });

    Object.assign(vidrio, req.body);
    await panol.save();
    res.json(vidrio);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

export const eliminarVidrio = async (req, res) => {
  try {
    assertValidId(req.params.id, "Vidrio");
    const panol = await obtenerPanolUsuario(req.user.id);
    panol.vidrios = panol.vidrios.filter(v => v._id.toString() !== req.params.id);
    await panol.save();
    res.json({ message: "Vidrio eliminado" });
  } catch (error) {
    handleMongooseError(res, error);
  }
};

/** ======================== IMPORTACIONES Y ASIGNACIONES ======================== */
export const importMateriales = async (req, res) => {
  try {
    const { tipo } = req.params;
    const data = req.body;
    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ message: "No hay datos para importar" });
    }

    const panol = await obtenerPanolUsuario(req.user.id);
    if (["perfiles", "vidrios", "accesorios", "herramientas"].includes(tipo)) {
      panol[tipo].push(...data);
      await panol.save();
      return res.json({ message: "Materiales importados correctamente" });
    }

    res.status(400).json({ message: "Tipo no válido" });
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

    const panol = await obtenerPanolUsuario(req.user.id);
    const asignados = [];
    const faltantes = [];

    for (const item of items) {
      const perfil = panol.perfiles.find(
        (p) => p.codigo === item.codigo && p.color === item.color
      );

      if (!perfil || perfil.cantidad < item.cantidad) {
        faltantes.push({
          ...item,
          stock: perfil?.cantidad || 0
        });
        continue;
      }

      perfil.cantidad -= item.cantidad;
      asignados.push(item);
    }

    await panol.save();
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

    const panol = await obtenerPanolUsuario(req.user.id);
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

      const perfil = panol.perfiles.find(
        (p) => p.codigo === codigo && p.color === color
      );

      if (!perfil || perfil.cantidad < cantidad) {
        faltantes.push({ codigo, color, cantidad, stock: perfil?.cantidad || 0 });
        continue;
      }

      perfil.cantidad -= cantidad;
      asignados.push({ codigo, color, cantidad });
    }

    await panol.save();
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

    const panol = await obtenerPanolUsuario(req.user.id);
    const asignados = [];
    const faltantes = [];

    for (const item of items) {
      const acc = panol.accesorios.find(
        (a) => a.codigo === item.codigo && a.color === item.color
      );

      if (!acc || acc.cantidad < item.cantidad) {
        faltantes.push({ ...item, stock: acc?.cantidad || 0 });
        continue;
      }

      acc.cantidad -= item.cantidad;
      asignados.push(item);
    }

    await panol.save();
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

    const panol = await obtenerPanolUsuario(req.user.id);
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

      const acc = panol.accesorios.find(
        (a) => a.codigo === codigo && a.color === color
      );

      if (!acc || acc.cantidad < cantidad) {
        faltantes.push({ codigo, color, cantidad, stock: acc?.cantidad || 0 });
        continue;
      }

      acc.cantidad -= cantidad;
      asignados.push({ codigo, color, cantidad });
    }

    await panol.save();
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

    const panol = await obtenerPanolUsuario(req.user.id);
    const asignados = [];
    const faltantes = [];

    for (const pedido of items) {
      const candidatos = panol.vidrios
        .filter(v => v.ancho >= pedido.ancho && v.alto >= pedido.alto && v.cantidad > 0)
        .sort((a, b) => (a.ancho * a.alto - pedido.ancho * pedido.alto) - (b.ancho * b.alto - pedido.ancho * pedido.alto));

      const sugerido = candidatos[0];

      if (!sugerido) {
        faltantes.push({ ...pedido, motivo: "No hay vidrio con medidas suficientes" });
        continue;
      }

      sugerido.cantidad -= 1;
      asignados.push({ ...pedido, asignado: { ancho: sugerido.ancho, alto: sugerido.alto } });
    }

    await panol.save();
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

    const panol = await obtenerPanolUsuario(req.user.id);
    const asignados = [];
    const faltantes = [];

    for (const raw of items) {
      const ancho = parseFloat(raw.ancho || 0);
      const alto = parseFloat(raw.alto || 0);

      if (!ancho || !alto || ancho <= 0 || alto <= 0) {
        faltantes.push({ ...raw, motivo: "Medidas inválidas" });
        continue;
      }

      const candidatos = panol.vidrios
        .filter(v => v.ancho >= ancho && v.alto >= alto && v.cantidad > 0)
        .sort((a, b) => (a.ancho * a.alto - ancho * alto) - (b.ancho * b.alto - ancho * alto));

      const sugerido = candidatos[0];

      if (!sugerido) {
        faltantes.push({ ancho, alto, motivo: "Sin vidrio adecuado" });
        continue;
      }

      sugerido.cantidad -= 1;
      asignados.push({ ancho, alto, asignado: { ancho: sugerido.ancho, alto: sugerido.alto } });
    }

    await panol.save();
    res.json({ asignados, faltantes });
  } catch (error) {
    handleMongooseError(res, error);
  }
};
export const asignarHerramienta = async (req, res) => {
  try {
    const { herramienta, obra, responsable, cantidad } = req.body;
    const userId = req.user.id;

    const panol = await obtenerPanolUsuario(req.user.id);

    if (!panol) return res.status(404).json({ message: "Pañol no encontrado" });

    const herramientaObj = panol.herramientas.id(herramienta);
    if (!herramientaObj) return res.status(404).json({ message: "Herramienta no encontrada" });

    // Actualizar estado y datos
    herramientaObj.estado = "en obra";
    herramientaObj.obra = obra;
    herramientaObj.responsable = responsable;

    // Agregar al historial
    herramientaObj.historial.push({
      fecha: new Date(),
      estadoAnterior: herramientaObj.estado,
      estadoNuevo: "en obra",
      obra,
      responsable
    });

    await panol.save();
    res.status(200).json({ message: "Herramienta asignada correctamente", herramienta: herramientaObj });
  } catch (err) {
    console.error("Error al asignar herramienta:", err);
    res.status(500).json({ message: "Error interno", error: err.message });
  }
};

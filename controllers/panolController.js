import Panol from "../models/panol.js";

/**
 * 📌 Obtener el estado del pañol
 */
export const obtenerPanol = async (req, res) => {
  try {
    let panol = await Panol.findOne({ user: req.user.id }).populate("herramientas.obra herramientas.responsable");
    if (!panol) {
      panol = new Panol({ user: req.user.id });
      await panol.save();
    }
    res.json(panol);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el pañol", error: error.message });
  }
};

/** ===========================
 * 📌 MÉTODOS PARA HERRAMIENTAS
 * ===========================*/

/**
 * Agregar una nueva herramienta
 */
export const agregarHerramienta = async (req, res) => {
  try {
    const { marca, modelo, descripcion, numeroSerie, estado, obra, responsable } = req.body;

    if (!marca || !modelo || !descripcion || !numeroSerie.trim()) {
      return res.status(400).json({ message: "Todos los campos son requeridos." });
    }

    let panol = await Panol.findOne({ user: req.user.id });
    if (!panol) panol = new Panol({ user: req.user.id });

    const nuevaHerramienta = {
      marca, modelo, descripcion, numeroSerie, estado, obra, responsable,
      historial: [{ fecha: new Date(), estadoNuevo: estado, obra, responsable }]
    };

    panol.herramientas.push(nuevaHerramienta);
    await panol.save();

    res.status(201).json(nuevaHerramienta);
  } catch (error) {
    res.status(400).json({ message: "Error al agregar herramienta", error: error.message });
  }
};

/**
 * Registrar movimiento de herramienta
 */
export const registrarMovimientoHerramienta = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, obra, responsable } = req.body;

    let panol = await Panol.findOne({ user: req.user.id });
    if (!panol) return res.status(404).json({ message: "Pañol no encontrado" });

    let herramienta = panol.herramientas.id(id);
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
    res.status(400).json({ message: "Error al registrar movimiento", error: error.message });
  }
};

/**
 * Modificar estado de herramienta
 */
export const modificarHerramienta = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, obra, responsable } = req.body;

    let panol = await Panol.findOne({ user: req.user.id });
    if (!panol) return res.status(404).json({ message: "Pañol no encontrado" });

    let herramienta = panol.herramientas.id(id);
    if (!herramienta) return res.status(404).json({ message: "Herramienta no encontrada" });

    herramienta.estado = estado;
    herramienta.obra = estado === "en obra" ? obra : null;
    herramienta.responsable = estado === "en obra" ? responsable : null;

    await panol.save();
    res.json(herramienta);
  } catch (error) {
    res.status(400).json({ message: "Error al modificar herramienta", error: error.message });
  }
};

/**
 * Eliminar herramienta
 */
export const eliminarHerramienta = async (req, res) => {
  try {
    let panol = await Panol.findOne({ user: req.user.id });
    if (!panol) return res.status(404).json({ message: "Pañol no encontrado" });

    panol.herramientas = panol.herramientas.filter(h => h._id.toString() !== req.params.id);
    await panol.save();
    res.json({ message: "Herramienta eliminada" });
  } catch (error) {
    res.status(400).json({ message: "Error al eliminar herramienta", error: error.message });
  }
};

/** ===========================
 * 📌 MÉTODOS PARA PERFILES
 * ===========================*/

/**
 * Crear un nuevo perfil
 */
export const agregarPerfil = async (req, res) => {
  try {
    const { codigo, cantidad, descripcion, largo, pesoxmetro, color } = req.body;

    let panol = await Panol.findOne({ user: req.user.id });
    if (!panol) panol = new Panol({ user: req.user.id });

    const nuevoPerfil = { codigo, cantidad, descripcion, largo, pesoxmetro, color };
    panol.perfiles.push(nuevoPerfil);

    await panol.save();
    res.status(201).json(nuevoPerfil);
  } catch (error) {
    res.status(400).json({ message: "Error al agregar perfil", error: error.message });
  }
};

/**
 * Modificar perfil
 */
export const modificarPerfil = async (req, res) => {
  try {
    const { id } = req.params;
    const cambios = req.body;

    let panol = await Panol.findOne({ user: req.user.id });
    if (!panol) return res.status(404).json({ message: "Pañol no encontrado" });

    let perfil = panol.perfiles.id(id);
    if (!perfil) return res.status(404).json({ message: "Perfil no encontrado" });

    Object.assign(perfil, cambios);

    await panol.save();
    res.json(perfil);
  } catch (error) {
    res.status(400).json({ message: "Error al modificar perfil", error: error.message });
  }
};

/**
 * Eliminar perfil
 */
export const eliminarPerfil = async (req, res) => {
  try {
    let panol = await Panol.findOne({ user: req.user.id });
    if (!panol) return res.status(404).json({ message: "Pañol no encontrado" });

    panol.perfiles = panol.perfiles.filter(p => p._id.toString() !== req.params.id);
    await panol.save();
    res.json({ message: "Perfil eliminado" });
  } catch (error) {
    res.status(400).json({ message: "Error al eliminar perfil", error: error.message });
  }
};

/** ===========================
 * 📌 MÉTODOS PARA ACCESORIOS
 * ===========================*/

/**
 * Crear un nuevo accesorio
 */
export const agregarAccesorio = async (req, res) => {
  try {
    const { codigo, descripcion, color, cantidad, unidad, tipo } = req.body;

    let panol = await Panol.findOne({ user: req.user.id });
    if (!panol) panol = new Panol({ user: req.user.id });

    const nuevoAccesorio = { codigo, descripcion, color, cantidad, unidad, tipo };
    panol.accesorios.push(nuevoAccesorio);

    await panol.save();
    res.status(201).json(nuevoAccesorio);
  } catch (error) {
    res.status(400).json({ message: "Error al agregar accesorio", error: error.message });
  }
};

/**
 * Modificar accesorio
 */
export const modificarAccesorio = async (req, res) => {
  try {
    const { id } = req.params;
    const cambios = req.body;

    let panol = await Panol.findOne({ user: req.user.id });
    if (!panol) return res.status(404).json({ message: "Pañol no encontrado" });

    let accesorio = panol.accesorios.id(id);
    if (!accesorio) return res.status(404).json({ message: "Accesorio no encontrado" });

    Object.assign(accesorio, cambios);

    await panol.save();
    res.json(accesorio);
  } catch (error) {
    res.status(400).json({ message: "Error al modificar accesorio", error: error.message });
  }
};

/**
 * Eliminar accesorio
 */
export const eliminarAccesorio = async (req, res) => {
  try {
    let panol = await Panol.findOne({ user: req.user.id });
    if (!panol) return res.status(404).json({ message: "Pañol no encontrado" });

    panol.accesorios = panol.accesorios.filter(a => a._id.toString() !== req.params.id);
    await panol.save();
    res.json({ message: "Accesorio eliminado" });
  } catch (error) {
    res.status(400).json({ message: "Error al eliminar accesorio", error: error.message });
  }
};
/** ===========================
 * 📌 MÉTODOS PARA VIDRIOS
 * ===========================*/

/**
 * Crear un nuevo vidrio
 */
export const agregarVidrio = async (req, res) => {
  try {
    const {  descripcion, cantidad, ancho, alto, tipo } = req.body;

    if ( !descripcion || cantidad == null || !ancho || !alto) {
      return res.status(400).json({ message: "Todos los campos son requeridos." });
    }

    let panol = await Panol.findOne({ user: req.user.id });
    if (!panol) panol = new Panol({ user: req.user.id });

    const nuevoVidrio = { descripcion, cantidad, ancho, alto, tipo };
    panol.vidrios.push(nuevoVidrio);

    await panol.save();
    res.status(201).json(nuevoVidrio);
  } catch (error) {
    res.status(400).json({ message: "Error al agregar vidrio", error: error.message });
  }
};

/**
 * Modificar un vidrio
 */
export const modificarVidrio = async (req, res) => {
  try {
    const { id } = req.params;
    const cambios = req.body;

    let panol = await Panol.findOne({ user: req.user.id });
    if (!panol) return res.status(404).json({ message: "Pañol no encontrado" });

    let vidrio = panol.vidrios.id(id);
    if (!vidrio) return res.status(404).json({ message: "Vidrio no encontrado" });

    Object.assign(vidrio, cambios);

    await panol.save();
    res.json(vidrio);
  } catch (error) {
    res.status(400).json({ message: "Error al modificar vidrio", error: error.message });
  }
};

/**
 * Eliminar un vidrio
 */
export const eliminarVidrio = async (req, res) => {
  try {
    let panol = await Panol.findOne({ user: req.user.id });
    if (!panol) return res.status(404).json({ message: "Pañol no encontrado" });

    panol.vidrios = panol.vidrios.filter(v => v._id.toString() !== req.params.id);
    await panol.save();
    res.json({ message: "Vidrio eliminado" });
  } catch (error) {
    res.status(400).json({ message: "Error al eliminar vidrio", error: error.message });
  }
};
/**
 * Asignar perfiles desde carga manual
 */
export const asignarPerfilesManual = async (req, res) => {
  try {
    const { obra, items } = req.body;

    if (!obra || !Array.isArray(items)) {
      return res.status(400).json({ message: "Datos inválidos" });
    }

    const panol = await Panol.findOne({ user: req.user.id });
    if (!panol) return res.status(404).json({ message: "Pañol no encontrado" });

    const asignados = [];
    const faltantes = [];

    for (const item of items) {
      const perfil = panol.perfiles.find(
        (p) => p.codigo === item.codigo && p.color === item.color
      );

      if (!perfil || perfil.cantidad < item.cantidad) {
        faltantes.push({
          codigo: item.codigo,
          color: item.color,
          cantidad: item.cantidad,
          stock: perfil?.cantidad || 0
        });
        continue;
      }

      perfil.cantidad -= item.cantidad;
      asignados.push(item);
    }

    await panol.save();
    return res.json({ asignados, faltantes });
  } catch (err) {
    console.error("Error asignando perfiles manual:", err);
    res.status(500).json({ message: "Error al asignar perfiles", error: err.message });
  }
};

/**
 * Asignar perfiles desde archivo Excel
 */
export const asignarPerfilesDesdeExcel = async (req, res) => {
  try {
    const { obra, items } = req.body;

    if (!obra || !Array.isArray(items)) {
      return res.status(400).json({ message: "Datos inválidos" });
    }

    const panol = await Panol.findOne({ user: req.user.id });
    if (!panol) return res.status(404).json({ message: "Pañol no encontrado" });

    const asignados = [];
    const faltantes = [];

    for (const raw of items) {
      const codigo = raw.codigo?.trim();
      const color = raw.color?.trim();
      const cantidad = parseFloat(raw.cantidad || 0);

      if (!codigo || !color || cantidad <= 0) {
        faltantes.push({ codigo, color, cantidad, motivo: "Datos inválidos" });
        continue;
      }

      const perfil = panol.perfiles.find(
        (p) => p.codigo === codigo && p.color === color
      );

      if (!perfil || perfil.cantidad < cantidad) {
        faltantes.push({
          codigo,
          color,
          cantidad,
          stock: perfil?.cantidad || 0
        });
        continue;
      }

      perfil.cantidad -= cantidad;
      asignados.push({ codigo, color, cantidad });
    }

    await panol.save();
    return res.json({ asignados, faltantes });
  } catch (err) {
    console.error("Error asignando perfiles desde Excel:", err);
    res.status(500).json({ message: "Error al importar Excel", error: err.message });
  }
};
/**
 * Asignar accesorios desde carga manual
 */
export const asignarAccesoriosManual = async (req, res) => {
  try {
    const { obra, items } = req.body;
    if (!obra || !Array.isArray(items)) {
      return res.status(400).json({ message: "Datos inválidos" });
    }

    const panol = await Panol.findOne({ user: req.user.id });
    if (!panol) return res.status(404).json({ message: "Pañol no encontrado" });

    const asignados = [];
    const faltantes = [];

    for (const item of items) {
      const acc = panol.accesorios.find(
        (a) => a.codigo === item.codigo && a.color === item.color
      );

      if (!acc || acc.cantidad < item.cantidad) {
        faltantes.push({
          codigo: item.codigo,
          color: item.color,
          cantidad: item.cantidad,
          stock: acc?.cantidad || 0
        });
        continue;
      }

      acc.cantidad -= item.cantidad;
      asignados.push(item);
    }

    await panol.save();
    return res.json({ asignados, faltantes });
  } catch (err) {
    console.error("Error asignando accesorios manual:", err);
    res.status(500).json({ message: "Error al asignar accesorios", error: err.message });
  }
};

/**
 * Asignar accesorios desde Excel
 */
export const asignarAccesoriosDesdeExcel = async (req, res) => {
  try {
    const { obra, items } = req.body;
    if (!obra || !Array.isArray(items)) {
      return res.status(400).json({ message: "Datos inválidos" });
    }

    const panol = await Panol.findOne({ user: req.user.id });
    if (!panol) return res.status(404).json({ message: "Pañol no encontrado" });

    const asignados = [];
    const faltantes = [];

    for (const raw of items) {
      const codigo = raw.codigo?.trim();
      const color = raw.color?.trim();
      const cantidad = parseFloat(raw.cantidad || 0);

      if (!codigo || !color || cantidad <= 0) {
        faltantes.push({ codigo, color, cantidad, motivo: "Datos inválidos" });
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
    return res.json({ asignados, faltantes });
  } catch (err) {
    console.error("Error asignando accesorios desde Excel:", err);
    res.status(500).json({ message: "Error al importar accesorios", error: err.message });
  }
};
/**
 * Asignar vidrios desde carga manual
 */
export const asignarVidriosManual = async (req, res) => {
  try {
    const { obra, items } = req.body;
    if (!obra || !Array.isArray(items)) {
      return res.status(400).json({ message: "Datos inválidos" });
    }

    const panol = await Panol.findOne({ user: req.user.id });
    if (!panol) return res.status(404).json({ message: "Pañol no encontrado" });

    const asignados = [];
    const faltantes = [];

    for (const pedido of items) {
      const candidatos = panol.vidrios
        .filter((v) => v.ancho >= pedido.ancho && v.alto >= pedido.alto && v.cantidad > 0)
        .sort((a, b) => {
          const desperdicioA = (a.ancho * a.alto) - (pedido.ancho * pedido.alto);
          const desperdicioB = (b.ancho * b.alto) - (pedido.ancho * pedido.alto);
          return desperdicioA - desperdicioB;
        });

      const sugerido = candidatos[0];

      if (!sugerido) {
        faltantes.push({ ...pedido, motivo: "No hay vidrio con medidas suficientes" });
        continue;
      }

      sugerido.cantidad -= 1;
      asignados.push({ ...pedido, asignado: { ancho: sugerido.ancho, alto: sugerido.alto } });
    }

    await panol.save();
    return res.json({ asignados, faltantes });
  } catch (err) {
    console.error("Error asignando vidrios manual:", err);
    res.status(500).json({ message: "Error al asignar vidrios", error: err.message });
  }
};

/**
 * Asignar vidrios desde Excel
 */
export const asignarVidriosDesdeExcel = async (req, res) => {
  try {
    const { obra, items } = req.body;
    if (!obra || !Array.isArray(items)) {
      return res.status(400).json({ message: "Datos inválidos" });
    }

    const panol = await Panol.findOne({ user: req.user.id });
    if (!panol) return res.status(404).json({ message: "Pañol no encontrado" });

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
        .filter((v) => v.ancho >= ancho && v.alto >= alto && v.cantidad > 0)
        .sort((a, b) => {
          const desperdicioA = (a.ancho * a.alto) - (ancho * alto);
          const desperdicioB = (b.ancho * b.alto) - (ancho * alto);
          return desperdicioA - desperdicioB;
        });

      const sugerido = candidatos[0];

      if (!sugerido) {
        faltantes.push({ ancho, alto, motivo: "Sin vidrio adecuado" });
        continue;
      }

      sugerido.cantidad -= 1;
      asignados.push({ ancho, alto, asignado: { ancho: sugerido.ancho, alto: sugerido.alto } });
    }

    await panol.save();
    return res.json({ asignados, faltantes });
  } catch (err) {
    console.error("Error asignando vidrios desde Excel:", err);
    res.status(500).json({ message: "Error al importar vidrios", error: err.message });
  }
};

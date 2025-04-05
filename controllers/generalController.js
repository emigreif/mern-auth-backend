import PerfilGeneral from "../models/PerfilGeneral.js";
import CamaraGeneral from "../models/camaraGeneral.js";
import VidrioGeneral from "../models/VidrioGeneral.js";
import AccesorioGeneral from "../models/accesorioGeneral.js";
import ProveedorGeneral from "../models/proveedorGeneral.js";
import xlsx from "xlsx";

import {
  assertValidId,
  handleMongooseError
} from "../utils/validationHelpers.js";
const importarDesdeExcel = (Model, mapRow) => {
  return async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No se subió ningún archivo" });
      }

      const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

      let nuevos = 0;
      let actualizados = 0;
      let errores = [];

      for (const row of data) {
        const { query, doc } = mapRow(row);

        try {
          const existente = await Model.findOne(query);
          if (existente) {
            Object.assign(existente, doc);
            await existente.save();
            actualizados++;
          } else {
            await Model.create(doc);
            nuevos++;
          }
        } catch (error) {
          errores.push({ row, error: error.message });
        }
      }

      res.json({ message: "Importación completada", nuevos, actualizados, errores });
    } catch (error) {
      handleMongooseError(res, error);
    }
  };
};

// Importaciones
export const importarPerfiles = importarDesdeExcel(PerfilGeneral, (row) => ({
  query: { codigo: row["Codigo"]?.toString().trim() },
  doc: {
    codigo: row["Codigo"]?.toString().trim(),
    descripcion: row["Descripcion"]?.toString().trim(),
    extrusora: row["Extrusora"]?.toString().trim(),
    largo: parseFloat(row["Largo"]?.toString().replace(",", ".")) || 0,
    peso: parseFloat(row["Peso x Metro"]?.toString().replace(",", ".")) || 0,
    linea:
      typeof row["Linea"] === "string"
        ? row["Linea"].split(",").map((l) => l.trim())
        : Array.isArray(row["Linea"])
        ? row["Linea"]
        : [],
  },
}));

export const importarVidrios = importarDesdeExcel(VidrioGeneral, (row) => ({
  query: { descripcion: row["Descripcion"] },
  doc: {
    descripcion: row["Descripcion"]?.toString().trim(),
    espesor: parseFloat(row["Espesor"]?.toString().replace(",", ".")) || 0,
  },
}));

export const importarAccesorios = importarDesdeExcel(AccesorioGeneral, (row) => ({
  query: { codigo: row["Codigo"]?.toString().trim() },
  doc: {
    codigo: row["Codigo"]?.toString().trim(),
    descripcion: row["Descripcion"]?.toString().trim(),
    color: row["Color"]?.toString().trim(),
    unidad: row["Unidad"]?.toString().trim() || "u",
    tipo: row["Tipo"]?.toString().trim().toLowerCase(),
  },
}));

export const importarCamaras = importarDesdeExcel(CamaraGeneral, (row) => ({
  query: { tipo: row["Tipo"] },
  doc: {
    tipo: row["Tipo"]?.toString().trim(),
    descripcion: row["Descripcion"]?.toString().trim(),
    valorK: parseFloat(row["Valor K"]?.toString().replace(",", ".")) || 0,
  },
}));

export const importarProveedores = importarDesdeExcel(ProveedorGeneral, (row) => {
  const nombre = row["Nombre"]?.toString().trim();
  const direccion = row["Direccion"]?.toString().trim() || "";

  const doc = {
    nombre,
    direccion,
    emails: (row["Emails"] || row["Email"] || "")
      .toString()
      .split(",")
      .map(e => e.trim())
      .filter(Boolean),
    telefono: (row["Telefono"] || row["Teléfonos"] || "")
      .toString()
      .split(",")
      .map(t => t.trim())
      .filter(Boolean),
    whatsapp: (row["Whatsapp"] || "")
      .toString()
      .split(",")
      .map(w => w.trim())
      .filter(Boolean),
    marcas: (row["Marcas"] || "")
      .toString()
      .split(",")
      .map(m => m.trim())
      .filter(Boolean),
    rubro: (row["Rubro"] || row["Rubros"] || "")
      .toString()
      .split(",")
      .map(r => r.trim())
      .filter(Boolean),
  };

  return {
    query: { nombre },
    doc,
  };
});
export const obtenerProveedores = async (req, res) => {
  try {
    const proveedores = await ProveedorGeneral.find();
    res.json(proveedores);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

export const agregarProveedor = async (req, res) => {
  try {
    const { nombre, direccion } = req.body;

    if (!nombre || !direccion) {
      return res.status(400).json({ message: "Nombre y dirección son obligatorios" });
    }

    const proveedor = new ProveedorGeneral(req.body);
    await proveedor.save();
    res.status(201).json(proveedor);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

export const actualizarProveedor = async (req, res) => {
  try {
    assertValidId(req.params.id, "Proveedor");

    const proveedor = await ProveedorGeneral.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(proveedor);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

export const eliminarProveedor = async (req, res) => {
  try {
    assertValidId(req.params.id, "Proveedor");

    await ProveedorGeneral.findByIdAndDelete(req.params.id);
    res.json({ message: "Proveedor eliminado" });
  } catch (error) {
    handleMongooseError(res, error);
  }
};

export const obtenerCamaras = async (req, res) => {
  try {
    const camaras = await CamaraGeneral.find();
    res.json(camaras);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

export const agregarCamara = async (req, res) => {
  try {
    const { descripcion, espesor } = req.body;
    const nuevaCamara = new CamaraGeneral({ descripcion, espesor });
    await nuevaCamara.save();
    res.status(201).json(nuevaCamara);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

export const actualizarCamara = async (req, res) => {
  try {
    assertValidId(req.params.id, "Cámara");

    const camara = await CamaraGeneral.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(camara);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

export const eliminarCamara = async (req, res) => {
  try {
    assertValidId(req.params.id, "Cámara");

    await CamaraGeneral.findByIdAndDelete(req.params.id);
    res.json({ message: "Cámara eliminada" });
  } catch (error) {
    handleMongooseError(res, error);
  }
};

export const obtenerAccesorios = async (req, res) => {
  try {
    const accesorios = await AccesorioGeneral.find();
    res.json(accesorios);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

export const agregarAccesorio = async (req, res) => {
  try {
    const nuevo = new AccesorioGeneral(req.body);
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

export const actualizarAccesorio = async (req, res) => {
  try {
    assertValidId(req.params.id, "Accesorio");

    const accesorio = await AccesorioGeneral.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(accesorio);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

export const eliminarAccesorio = async (req, res) => {
  try {
    assertValidId(req.params.id, "Accesorio");

    await AccesorioGeneral.findByIdAndDelete(req.params.id);
    res.json({ message: "Accesorio eliminado" });
  } catch (error) {
    handleMongooseError(res, error);
  }
};

export const obtenerPerfiles = async (req, res) => {
  try {
    const perfiles = await PerfilGeneral.find();
    res.json(perfiles);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

export const agregarPerfil = async (req, res) => {
  try {
    const { codigo, descripcion, extrusora, linea, largo, peso } = req.body;

    const perfil = new PerfilGeneral({
      codigo: codigo?.trim() || null,
      descripcion: descripcion?.trim(),
      extrusora: extrusora?.trim() || null,
      linea: Array.isArray(linea)
        ? linea
        : typeof linea === "string"
        ? linea.split(",").map((l) => l.trim())
        : [],
      largo: largo ? parseFloat(largo.toString().replace(",", ".")) : 0,
      peso: peso ? parseFloat(peso.toString().replace(",", ".")) : 0
    });

    const perfilGuardado = await perfil.save();
    res.status(201).json(perfilGuardado);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

export const actualizarPerfil = async (req, res) => {
  try {
    assertValidId(req.params.id, "Perfil");

    const perfil = await PerfilGeneral.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(perfil);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

export const eliminarPerfil = async (req, res) => {
  try {
    assertValidId(req.params.id, "Perfil");

    await PerfilGeneral.findByIdAndDelete(req.params.id);
    res.json({ message: "Perfil eliminado" });
  } catch (error) {
    handleMongooseError(res, error);
  }
};

export const obtenerVidrios = async (req, res) => {
  try {
    const vidrios = await VidrioGeneral.find();
    res.json(vidrios);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

export const agregarVidrio = async (req, res) => {
  try {
    const { descripcion, espesor } = req.body;
    const nuevoVidrio = new VidrioGeneral({ descripcion, espesor });
    await nuevoVidrio.save();
    res.status(201).json(nuevoVidrio);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

export const actualizarVidrio = async (req, res) => {
  try {
    assertValidId(req.params.id, "Vidrio");

    const vidrio = await VidrioGeneral.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(vidrio);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

export const eliminarVidrio = async (req, res) => {
  try {
    assertValidId(req.params.id, "Vidrio");

    await VidrioGeneral.findByIdAndDelete(req.params.id);
    res.json({ message: "Vidrio eliminado" });
  } catch (error) {
    handleMongooseError(res, error);
  }
};

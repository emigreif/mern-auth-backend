import PerfilGeneral from "../models/PerfilGeneral.js";
import CamaraGeneral from "../models/camaraGeneral.js";
import VidrioGeneral from "../models/VidrioGeneral.js";
import AccesorioGeneral from "../models/accesorioGeneral.js";
import ProveedorGeneral from "../models/proveedorGeneral.js";
import xlsx from "xlsx";

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
        console.log("🧾 DOC A IMPORTAR", doc); 

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

      res.json({
        message: "Importación completada",
        nuevos,
        actualizados,
        errores,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al importar archivo" });
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

export const importarProveedores = importarDesdeExcel(ProveedorGeneral, (row) => ({
  query: { nombre: row["Nombre"]?.toString().trim() },
  doc: {
    nombre: row["Nombre"]?.toString().trim(),
    direccion: row["Direccion"]?.toString().trim() || "",
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
  }
}));


export const obtenerProveedores = async (req, res) => {
  try {
    const proveedores = await ProveedorGeneral.find();
    res.json(proveedores);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener proveedores", error: error.message });
  }
};

export const agregarProveedor = async (req, res) => {
  try {
    const proveedor = new ProveedorGeneral(req.body);
    await proveedor.save();
    res.status(201).json(proveedor);
  } catch (error) {
    res.status(400).json({ message: "Error al agregar proveedor", error: error.message });
  }
};

export const actualizarProveedor = async (req, res) => {
  try {
    const proveedor = await ProveedorGeneral.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(proveedor);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar proveedor", error: error.message });
  }
};

export const eliminarProveedor = async (req, res) => {
  try {
    await ProveedorGeneral.findByIdAndDelete(req.params.id);
    res.json({ message: "Proveedor eliminado" });
  } catch (error) {
    res.status(400).json({ message: "Error al eliminar proveedor", error: error.message });
  }
};


export const obtenerCamaras = async (req, res) => {
  try {
    const camaras = await CamaraGeneral.find();
    res.json(camaras);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener cámaras", error: error.message });
  }
};

export const agregarCamara = async (req, res) => {
  try {
    const { descripcion, espesor } = req.body;
    const nuevaCamara = new CamaraGeneral({ descripcion, espesor });
    await nuevaCamara.save();
    res.status(201).json(nuevaCamara);
  } catch (error) {
    res.status(400).json({ message: "Error al agregar cámara", error: error.message });
  }
};

export const actualizarCamara = async (req, res) => {
  try {
    const camara = await CamaraGeneral.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(camara);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar cámara", error: error.message });
  }
};

export const eliminarCamara = async (req, res) => {
  try {
    await CamaraGeneral.findByIdAndDelete(req.params.id);
    res.json({ message: "Cámara eliminada" });
  } catch (error) {
    res.status(400).json({ message: "Error al eliminar cámara", error: error.message });
  }
};


export const obtenerAccesorios = async (req, res) => {
  try {
    const accesorios = await AccesorioGeneral.find();
    res.json(accesorios);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener accesorios", error: error.message });
  }
};

export const agregarAccesorio = async (req, res) => {
  try {
    const nuevo = new AccesorioGeneral(req.body);
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(400).json({ message: "Error al agregar accesorio", error: error.message });
  }
};

export const actualizarAccesorio = async (req, res) => {
  try {
    const accesorio = await AccesorioGeneral.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(accesorio);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar accesorio", error: error.message });
  }
};

export const eliminarAccesorio = async (req, res) => {
  try {
    await AccesorioGeneral.findByIdAndDelete(req.params.id);
    res.json({ message: "Accesorio eliminado" });
  } catch (error) {
    res.status(400).json({ message: "Error al eliminar accesorio", error: error.message });
  }
};

// Perfiles
export const obtenerPerfiles = async (req, res) => {
  try {
    const perfiles = await PerfilGeneral.find();
    res.json(perfiles);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener perfiles", error: error.message });
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
      peso: peso ? parseFloat(peso.toString().replace(",", ".")) : 0,
    });

    const perfilGuardado = await perfil.save();
    res.status(201).json(perfilGuardado);
  } catch (error) {
    console.error("❌ Error al agregar perfil:", error);
    res.status(500).json({ message: "Error al agregar el perfil" });
  }
};

export const actualizarPerfil = async (req, res) => {
  try {
    const perfil = await PerfilGeneral.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(perfil);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar perfil", error: error.message });
  }
};

export const eliminarPerfil = async (req, res) => {
  try {
    await PerfilGeneral.findByIdAndDelete(req.params.id);
    res.json({ message: "Perfil eliminado" });
  } catch (error) {
    res.status(400).json({ message: "Error al eliminar perfil", error: error.message });
  }
};

// Vidrios
export const obtenerVidrios = async (req, res) => {
  try {
    const vidrios = await VidrioGeneral.find();
    res.json(vidrios);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener vidrios", error: error.message });
  }
};

export const agregarVidrio = async (req, res) => {
  try {
    const { descripcion, espesor } = req.body;
    const nuevoVidrio = new VidrioGeneral({ descripcion, espesor });
    await nuevoVidrio.save();
    res.status(201).json(nuevoVidrio);
  } catch (error) {
    res.status(400).json({ message: "Error al agregar vidrio", error: error.message });
  }
};

export const actualizarVidrio = async (req, res) => {
  try {
    const vidrio = await VidrioGeneral.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(vidrio);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar vidrio", error: error.message });
  }
};

export const eliminarVidrio = async (req, res) => {
  try {
    await VidrioGeneral.findByIdAndDelete(req.params.id);
    res.json({ message: "Vidrio eliminado" });
  } catch (error) {
    res.status(400).json({ message: "Error al eliminar vidrio", error: error.message });
  }
};


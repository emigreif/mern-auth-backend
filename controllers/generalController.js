import PerfilGeneral from "../models/PerfilGeneral.js";
import CamaraGeneral from "../models/camaraGeneral.js";
import VidrioGeneral from "../models/VidrioGeneral.js";
import AccesorioGeneral from "../models/accesorioGeneral.js";
import xlsx from "xlsx";




// Listar
export const obtenerAccesorios = async (req, res) => {
  try {
    const accesorios = await AccesorioGeneral.find();
    res.json(accesorios);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener accesorios", error: error.message });
  }
};

// Agregar
export const agregarAccesorio = async (req, res) => {
  try {
    const nuevo = new AccesorioGeneral(req.body);
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(400).json({ message: "Error al agregar accesorio", error: error.message });
  }
};

// Importar
export const importarAccesorios = async (req, res) => {
  try {
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    const accesorios = data.map((row) => ({
      codigo: row["Codigo"],
      descripcion: row["Descripcion"],
      color: row["Color"],
      cantidad: Number(row["Cantidad"]),
      unidad: row["Unidad"] || "u",
      tipo: row["Tipo"],
    }));

    await AccesorioGeneral.insertMany(accesorios);
    res.json({ message: "Accesorios importados con éxito" });
  } catch (error) {
    res.status(400).json({ message: "Error al importar accesorios", error: error.message });
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

/**
 * Obtener todos los perfiles
 */
export const obtenerPerfiles = async (req, res) => {
  try {
    const perfiles = await PerfilGeneral.find();
    res.json(perfiles);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener perfiles", error: error.message });
  }
};

/**
 * Agregar un nuevo perfil
 */
export const agregarPerfil = async (req, res) => {
  try {
    const { descripcion, extrusora } = req.body;
    const nuevoPerfil = new PerfilGeneral({ descripcion, extrusora });
    await nuevoPerfil.save();
    res.status(201).json(nuevoPerfil);
  } catch (error) {
    res.status(400).json({ message: "Error al agregar perfil", error: error.message });
  }
};

/**
 * Importar perfiles desde Excel
 */

export const importarPerfiles = async (req, res) => {
  try {
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const data = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    const perfiles = data.map((row) => {
      return {
        codigo: row["Codigo"] || "",
        descripcion: row["Descripcion"] || "",
        extrusora: row["Extrusora"] || "",
        linea: typeof row["Linea"] === "string"
          ? row["Linea"].split(",").map((l) => l.trim()) // convierte a array
          : [],
        largo: parseFloat(String(row["Largo"]).replace(",", ".")) || 0,
        peso: parseFloat(String(row["Peso x Metro"]).replace(",", ".")) || 0,
      };
    });

    const result = await PerfilGeneral.insertMany(perfiles);
    res.status(200).json({
      message: `✅ ${result.length} perfiles importados correctamente`,
      data: result,
    });

  } catch (error) {
    console.error("❌ Error al importar perfiles:", error);
    res.status(500).json({
      message: "Error al importar perfiles",
      error: error.message,
    });
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

/**
 * Obtener todos los vidrios
 */
export const obtenerVidrios = async (req, res) => {
  try {
    const vidrios = await VidrioGeneral.find();
    res.json(vidrios);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener vidrios", error: error.message });
  }
};

/**
 * Agregar un nuevo vidrio
 */
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

/**
 * Importar vidrios desde Excel
 */
export const importarVidrios = async (req, res) => {
  try {
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);
    
    const vidrios = data.map((row) => ({
      descripcion: row["Descripcion"],
      espesor: row["Espesor"],
    }));

    await VidrioGeneral.insertMany(vidrios);
    res.json({ message: "Vidrios importados con éxito" });
  } catch (error) {
    res.status(400).json({ message: "Error al importar vidrios", error: error.message });
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

export const importarCamaras = async (req, res) => {
  try {
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    const camaras = data.map((row) => ({
      descripcion: row["Descripcion"],
      espesor: row["Espesor"],
    }));

    await CamaraGeneral.insertMany(camaras);
    res.json({ message: "Cámaras importadas con éxito" });
  } catch (error) {
    res.status(400).json({ message: "Error al importar cámaras", error: error.message });
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

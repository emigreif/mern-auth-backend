import Obra from "../models/obra.js";
import { getById, create, update, remove } from "./baseController.js";
import {
  assertValidId,
  handleMongooseError
} from "../utils/validationHelpers.js";

// Listar obras con populate (cliente)
export const listarObras = async (req, res) => {
  try {
    const data = await Obra.find({ user: req.user.id }).populate("cliente", "nombre apellido");
    res.json(data);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

// Métodos base reutilizados
export const obtenerObra = getById(Obra);
export const crearObra = create(Obra);
export const actualizarObra = update(Obra);
export const eliminarObra = remove(Obra);

// Funciones OV personalizadas

const getObraOV = async (id, userId, res) => {
  assertValidId(id, "Obra");
  const obra = await Obra.findOne({ _id: id, user: userId });
  if (!obra) {
    res.status(404).json({ message: "Obra no encontrada" });
    return null;
  }
  return obra;
};

export const agregarPerfilesOV = async (req, res) => {
  try {
    const obra = await getObraOV(req.params.id, req.user.id, res);
    if (!obra) return;

    obra.perfilesOV.push(...req.body);
    await obra.save();
    res.json({ message: "Perfiles agregados a OV", perfilesOV: obra.perfilesOV });
  } catch (error) {
    handleMongooseError(res, error);
  }
};

export const agregarVidriosOV = async (req, res) => {
  try {
    const obra = await getObraOV(req.params.id, req.user.id, res);
    if (!obra) return;

    obra.vidriosOV.push(...req.body);
    await obra.save();
    res.json({ message: "Vidrios agregados a OV", vidriosOV: obra.vidriosOV });
  } catch (error) {
    handleMongooseError(res, error);
  }
};

export const agregarAccesoriosOV = async (req, res) => {
  try {
    const obra = await getObraOV(req.params.id, req.user.id, res);
    if (!obra) return;

    obra.accesoriosOV.push(...req.body);
    await obra.save();
    res.json({ message: "Accesorios agregados a OV", accesoriosOV: obra.accesoriosOV });
  } catch (error) {
    handleMongooseError(res, error);
  }
};

export const agregarTipologiasOV = async (req, res) => {
  try {
    const obra = await getObraOV(req.params.id, req.user.id, res);
    if (!obra) return;

    obra.tipologiasOV.push(...req.body);
    await obra.save();
    res.json({ message: "Tipologías agregadas a OV", tipologiasOV: obra.tipologiasOV });
  } catch (error) {
    handleMongooseError(res, error);
  }
};

export const eliminarItemOV = async (req, res) => {
  try {
    const { id, tipo, itemId } = req.params;
    assertValidId(id, "Obra");
    assertValidId(itemId, "Item");

    if (!["perfilesOV", "vidriosOV", "accesoriosOV", "tipologiasOV"].includes(tipo)) {
      return res.status(400).json({ message: "Tipo de material inválido" });
    }

    const obra = await Obra.findOne({ _id: id, user: req.user.id });
    if (!obra) return res.status(404).json({ message: "Obra no encontrada" });

    obra[tipo] = obra[tipo].filter((item) => item._id.toString() !== itemId);
    await obra.save();

    res.json({ message: `${tipo} actualizado`, [tipo]: obra[tipo] });
  } catch (error) {
    handleMongooseError(res, error);
  }
};

// Actualizar listas OV completas
export const actualizarPerfilesOV = async (req, res) => {
  try {
    const obra = await getObraOV(req.params.id, req.user.id, res);
    if (!obra) return;

    obra.perfilesOV = req.body;
    await obra.save();
    res.json({ message: "Perfiles OV actualizados", perfilesOV: obra.perfilesOV });
  } catch (error) {
    handleMongooseError(res, error);
  }
};

export const actualizarVidriosOV = async (req, res) => {
  try {
    const obra = await getObraOV(req.params.id, req.user.id, res);
    if (!obra) return;

    obra.vidriosOV = req.body;
    await obra.save();
    res.json({ message: "Vidrios OV actualizados", vidriosOV: obra.vidriosOV });
  } catch (error) {
    handleMongooseError(res, error);
  }
};

export const actualizarAccesoriosOV = async (req, res) => {
  try {
    const obra = await getObraOV(req.params.id, req.user.id, res);
    if (!obra) return;

    obra.accesoriosOV = req.body;
    await obra.save();
    res.json({ message: "Accesorios OV actualizados", accesoriosOV: obra.accesoriosOV });
  } catch (error) {
    handleMongooseError(res, error);
  }
};

export const actualizarTipologiasOV = async (req, res) => {
  try {
    const obra = await getObraOV(req.params.id, req.user.id, res);
    if (!obra) return;

    obra.tipologiasOV = req.body;
    await obra.save();
    res.json({ message: "Tipologías OV actualizadas", tipologiasOV: obra.tipologiasOV });
  } catch (error) {
    handleMongooseError(res, error);
  }
};

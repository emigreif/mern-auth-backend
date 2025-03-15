// controllers/obraController.js
import Obra from "../models/obra.js";
import { getById, create, update, remove } from "./baseController.js";

/**
 * getAll genérico no hace populate, así que creamos uno custom para listar
 */
export const listarObras = async (req, res) => {
  try {
    const data = await Obra.find({ user: req.user.id }).populate(
      "cliente",
      "nombre apellido"
    );
    res.json(data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener obras", error: error.message });
  }
};

export const obtenerObra = getById(Obra);
export const crearObra = create(Obra);
export const actualizarObra = update(Obra);
export const eliminarObra = remove(Obra);

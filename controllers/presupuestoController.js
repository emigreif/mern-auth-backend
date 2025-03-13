// backend/controllers/presupuestoController.js
import Presupuesto from "../models/Presupuesto.js";
import {  getById, create, update, remove } from "./BaseController.js";


export const obtenerPresupuesto = getById(Presupuesto);
export const crearPresupuesto = create(Presupuesto);
export const actualizarPresupuesto = update(Presupuesto);
export const eliminarPresupuesto = remove(Presupuesto);

export const listarPresupuestos = async (req, res) => {
    try {
      // Filtrar por user
      const data = await Presupuesto.find({ user: req.user.id })
        .populate("cliente", "nombre apellido"); 
        // "nombre apellido" => selecciona solo esos campos del cliente
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener presupuestos", error: error.message });
    }
  };
import Config from "../models/Config.js";
import { getAll, update } from "./BaseController.js";

export const obtenerConfiguracion = getAll(Config);
export const actualizarConfiguracion = update(Config);

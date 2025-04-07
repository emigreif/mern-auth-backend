// models/CompraAccesorios.js
import mongoose from "mongoose";
import CompraBase from "./CompraBase.js";

const compraAccesoriosSchema = new mongoose.Schema({
  accesorios: [
    {
      codigo: String,
      descripcion: String,
      color: String,
      cantidad: Number,
      cantidadIngresada: { type: Number, default: 0 }
    }
  ]
});

const CompraAccesorios = CompraBase.discriminator("accesorios", compraAccesoriosSchema);
export default CompraAccesorios;

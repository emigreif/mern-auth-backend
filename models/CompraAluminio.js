// models/CompraAluminio.js
import mongoose from "mongoose";
import CompraBase from "./CompraBase.js";

const compraAluminioSchema = new mongoose.Schema({
  pedido: [
    {
      codigo: String,
      descripcion: String,
      largo: Number,
      cantidad: Number,
      cantidadIngresada: { type: Number, default: 0 }
    }
  ]
});

const CompraAluminio = CompraBase.discriminator("aluminio", compraAluminioSchema);
export default CompraAluminio;

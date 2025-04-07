// models/CompraVidrios.js
import mongoose from "mongoose";
import CompraBase from "./CompraBase.js";

const compraVidriosSchema = new mongoose.Schema({
  vidrios: [
    {
      codigo: String,
      descripcion: String,
      ancho: Number,
      alto: Number,
      cantidad: Number,
      cantidadIngresada: { type: Number, default: 0 }
    }
  ]
});

const CompraVidrios = CompraBase.discriminator("vidrios", compraVidriosSchema);
export default CompraVidrios;

const mongoose = require("mongoose");

const CompraSchema = new mongoose.Schema({
  proveedor: { type: String, required: true },
  lugarEntrega: { type: String, required: true },
  materiales: [
    {
      codigo: String,
      descripcion: String,
      cantidad: Number,
      observaciones: String,
    },
  ],
  tipoCompra: { type: String, enum: ["stock", "obra", "no-productiva"], required: true },
  fechaCompra: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Compra", CompraSchema);

import mongoose from "mongoose";

const MedicionSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    obra: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Obra",
      required: true
    },
    ubicacion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ubicacion",
      required: true
    },
    tipologia: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tipologia",
      required: true
    },
    ancho: {
      type: Number,
      required: true
    },
    alto: {
      type: Number,
      required: true
    },
    cantidad: {
      type: Number,
      required: true,
      min: 1
    },
    observaciones: {
      type: String,
      default: ""
    },
    estado: {
      type: String,
      enum: ["pendiente", "confirmada", "rechazada"],
      default: "pendiente"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Medicion", MedicionSchema);

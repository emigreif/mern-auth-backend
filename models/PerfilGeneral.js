import mongoose from "mongoose";

const perfilGeneralSchema = new mongoose.Schema(
  {
    codigo: {
      type: String,
      required: false,
      trim: true,
    },
    descripcion: {
      type: String,
      required: true,
      trim: true,
    },
    extrusora: {
      type: String,
      required: false,
      trim: true,
    },
    linea: {
      type: [String], // Array de líneas
      default: [],
    },
    largo: {
      type: Number,
      required: false,
      default: 0,
    },
    peso: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const PerfilGeneral = mongoose.model("PerfilGeneral", perfilGeneralSchema);

export default PerfilGeneral;

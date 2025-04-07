// models/VidrioGeneral.js
import mongoose from "mongoose";

const vidrioGeneralSchema = new mongoose.Schema({
  descripcion: { type: String, required: true },
  espesor: { type: Number, required: true },
  peso_m2: { 
    type: Number, 
    required: true,
    default: function() { return this.espesor * 2.5; } // Cálculo automático
  }
});

const VidrioGeneral = mongoose.model("VidrioGeneral", vidrioGeneralSchema);
export default VidrioGeneral;

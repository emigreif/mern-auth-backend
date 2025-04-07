import mongoose from "mongoose";

const herramientaSchema = new mongoose.Schema({
  marca: String,
  modelo: String,
  descripcion: String,
  numeroSerie: { type: String, required: true, unique: true },
  estado: { type: String, enum: ["en taller", "en obra", "en reparación"], default: "en taller" },
  obra: { type: mongoose.Schema.Types.ObjectId, ref: "Obra", default: null },
  responsable: { type: mongoose.Schema.Types.ObjectId, ref: "Nomina", default: null },

  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const HerramientaPanol = mongoose.model("HerramientaPanol", herramientaSchema);
export default HerramientaPanol;

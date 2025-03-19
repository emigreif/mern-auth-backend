
import mongoose from "mongoose";

const herramientaSchema = new mongoose.Schema({
  marca: { type: String, required: true },
  modelo: { type: String, required: true },
  descripcion: { type: String, required: true },
  numeroSerie: { type: String, required: true, unique: true },
  estado: {
    type: String,
    enum: ["en taller", "en obra", "en reparación"],
    default: "en taller"
  },
  obra: { type: mongoose.Schema.Types.ObjectId, ref: "Obra", default: null }, // Si está en obra, referencia a la obra
  responsable: { type: mongoose.Schema.Types.ObjectId, ref: "Nomina", default: null } // Quién la retiró
});

const perfilSchema = new mongoose.Schema({
  codigo: { type: String, required: true },
  cantidad: { type: Number, required: true },
  descripcion: { type: String, required: true },
  largo: { type: Number, required: true },
  pesoxmetro: { type: Number, required: true },
  color: { type: String, required: true }
});

const accesorioSchema = new mongoose.Schema({
  codigo: { type: String, required: true },
  descripcion: { type: String, required: true },
  color: { type: String, required: true },
  cantidad: { type: Number, required: true },
  unidad: { type: String, required: true, default: "u" },
  tipo: {
    type: String,
    enum: ["accesorios", "herrajes", "tornillos", "bulones", "felpas", "selladores / espuma", "otro"],
    required: true
  }
});

const vidrioSchema = new mongoose.Schema({
  codigo: { type: String, required: true },
  descripcion: { type: String, required: true },
  cantidad: { type: Number, required: true },
  ancho: { type: Number, required: true },
  alto: { type: Number, required: true },
  tipo: {
    type: String,
    enum: ["simple", "dvh", "tvh"],
    default: "simple"
  }
});

const panolSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  herramientas: [herramientaSchema],
  perfiles: [perfilSchema],
  accesorios: [accesorioSchema],
  vidrios: [vidrioSchema]
});

const Panol = mongoose.model("Panol", panolSchema);
export default Panol;

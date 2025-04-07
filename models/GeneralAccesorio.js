import mongoose from "mongoose";

const accesorioSchema = new mongoose.Schema({
  codigo: { type: String, required: true },
  descripcion: { type: String, required: true },
  color: { type: String, required: true },
  unidad: { type: String, required: true, default: "u" },
  tipo: {
    type: String,
    enum: [
      "accesorios",
      "herrajes",
      "tornillos",
      "bulones",
      "felpas",
      "selladores / espuma",
      "otro",
    ],
    required: true,
  },
});

const AccesorioGeneral = mongoose.model("AccesorioGeneral", accesorioSchema);
export default AccesorioGeneral;

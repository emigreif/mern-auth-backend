import mongoose from "mongoose";

const camaraGeneralSchema = new mongoose.Schema({
  descripcion: {
    type: String,
    required: true,
  },
  espesor: {
    type: Number,
    required: true,
  },
});

const CamaraGeneral = mongoose.model("CamaraGeneral", camaraGeneralSchema);
export default CamaraGeneral;

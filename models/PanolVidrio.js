import mongoose from "mongoose";

const vidrioPanolSchema = new mongoose.Schema({
  descripcion: String,
  cantidad: Number,
  ancho: Number,
  alto: Number,
  tipo: { type: String, enum: ["simple", "dvh", "tvh" ], default: "simple" },
  
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const VidrioPanol = mongoose.model("VidrioPanol", vidrioPanolSchema);
export default VidrioPanol;

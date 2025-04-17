// models/proveedor.js
import mongoose from "mongoose";

const proveedorSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    direccion: {
      direccionFormateada: { type: String, required: true },
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    },
    emails: [{ type: String, trim: true, lowercase: true }],
    telefono: { type: String, trim: true },
    whatsapp: { type: String, trim: true },
    balance: { type: Number, default: 0 },
    rubro: [
      {
        type: String,
        enum: ["Vidrio", "Perfiles", "Accesorios", "Compras Generales", "otro"]
      }
    ],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

proveedorSchema.index({ user: 1 });

export default mongoose.model("Proveedor", proveedorSchema);

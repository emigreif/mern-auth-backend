import mongoose from "mongoose";

const proveedorGeneralSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  direccion: { type: String, required: false, trim: true }, // ← cambio aquí
  emails: [{ type: String, trim: true, lowercase: true }],
  telefono: [{ type: String, trim: true }],
  whatsapp: [{ type: String, trim: true }],
  marcas: [{ type: String, trim: true }],
  rubro: [
    {
      type: String,
      enum: ["Vidrio", "Perfiles", "Accesorios", "Insumos"],
    },
  ],
});

const ProveedorGeneral = mongoose.model("ProveedorGeneral", proveedorGeneralSchema);
export default ProveedorGeneral;

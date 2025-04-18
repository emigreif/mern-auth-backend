import mongoose from "mongoose";

const proveedorGeneralSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },

  // 📍 Dirección estructurada para geocoding
  direccion: {
    direccionFormateada: { type: String, required: false, trim: true },
    lat: { type: Number, required: false },
    lng: { type: Number, required: false },
  },

  sitioWeb: { type: String, trim: true }, // 🌐 Nuevo campo agregado

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

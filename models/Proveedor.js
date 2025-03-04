import mongoose from 'mongoose';

const proveedorSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  direccion: { type: String, required: true, trim: true },
  emails: [{ type: String, trim: true, lowercase: true }],
  telefono: { type: String, trim: true },
  whatsapp: { type: String, trim: true },
  // El balance se calcula externamente desde contabilidad; se inicializa en 0
  balance: { type: Number, default: 0 },
  rubro: [{ type: String, enum: ['Vidrio', 'Perfiles', 'Accesorios', 'Compras Generales'] }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model('Proveedor', proveedorSchema);

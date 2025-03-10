// backend/models/Config.js
import mongoose from 'mongoose';

const configSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  roles: {
    type: [String],
    default: ["Administrador", "Producción", "Ventas"]
  },
  impuestos: [
    {
      nombre: String,
      porcentaje: Number,
    },
  ],
  indicesSaldo: { type: Number, default: 1.05 },
  costoHora: { type: Number, default: 2000 },
}, { timestamps: true });

// ➜ Eliminamos duplicaciones de `user` y añadimos índice
configSchema.index({ user: 1 });

export default mongoose.model('Config', configSchema);

import mongoose from 'mongoose';

const configSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  roles: {
    type: [String],
    default: ["Administrador", "Producción", "Ventas"] // Ejemplo
  },
  impuestos: [
    {
      nombre: String,
      porcentaje: Number,
    },
  ],
  // Agrega otros campos de configuración que necesites, por ejemplo:
  indicesSaldo: { type: Number, default: 1.05 },
  costoHora: { type: Number, default: 2000 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model('Config', configSchema);

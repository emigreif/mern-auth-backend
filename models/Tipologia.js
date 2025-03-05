// backend/models/Tipologia.js
import mongoose from 'mongoose';

const tipologiaSchema = new mongoose.Schema({
  identificador: { type: String, required: true, unique: true, trim: true },
  descripcion: { type: String, required: true, trim: true },
  cantidad: { type: Number, default: 1 },
  ancho: { type: Number, required: true },
  alto: { type: Number, required: true },
  // Relación a la obra para la que se carga esta tipología
  obra: { type: mongoose.Schema.Types.ObjectId, ref: 'Obra', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model('Tipologia', tipologiaSchema);

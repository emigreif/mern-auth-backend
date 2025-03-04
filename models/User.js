// backend/models/User.js
import mongoose from 'mongoose';
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  razonSocial: { type: String, default: '' },
  cuit: { type: String, default: '' },
  plan: { type: String, default: 'Básico' },
  cantidadUsuarios: { type: Number, default: 1 },
  direccion: { type: String, default: '' },
  localidad: { type: String, default: '' },
  codigoPostal: { type: String, default: '' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model('User', UserSchema);

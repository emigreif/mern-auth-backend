// backend/models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  // Campos adicionales
  firstName: { type: String },
  lastName: { type: String },
  razonSocial: { type: String },
  cuit: { type: String },
  plan: { type: String },
  cantidadUsuarios: { type: Number },
  direccion: { type: String },
  localidad: { type: String },
  codigoPostal: { type: String }
}, {
  timestamps: true
});

export default mongoose.model('User', UserSchema);

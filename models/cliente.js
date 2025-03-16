// backend/models/Cliente.js
import mongoose from "mongoose";

/**
 * Modelo Cliente con campos básicos
 * + condicionFiscal: "responsableInscripto" o "consumidorFinal"
 * + razonSocial y cuit requeridos solo si responsable inscripto
 */

const clienteSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  apellido: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true },
  telefono: { type: String, trim: true },
  direccion: {
    calle: { type: String, trim: true },
    ciudad: { type: String, trim: true }
  },

  // Nuevo campo: condicionFiscal
  condicionFiscal: {
    type: String,
    enum: ["responsableInscripto", "consumidorFinal"],
    default: "consumidorFinal"
  },
  // Solo se usan si es responsableInscripto
  razonSocial: { type: String, trim: true },
  cuit: { type: String, trim: true },

  // Relación con el usuario (dueño de este cliente)
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, 
{ timestamps: true }
);

/**
 * Validación custom:
 * - Si condicionFiscal = "responsableInscripto", 
 *   entonces razonSocial y cuit deben existir.
 */
clienteSchema.pre("save", function (next) {
  if (this.condicionFiscal === "responsableInscripto") {
    if (!this.razonSocial || !this.razonSocial.trim()) {
      return next(new Error("La razón social es requerida para Responsable Inscripto."));
    }
    if (!this.cuit || !this.cuit.trim()) {
      return next(new Error("El CUIT es requerido para Responsable Inscripto."));
    }
  }
  next();
});

export default mongoose.model("Cliente", clienteSchema);

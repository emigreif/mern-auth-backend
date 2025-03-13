// backend/models/Presupuesto.js
import mongoose from "mongoose";

/**
 * Ejemplo: Generación auto-incremental de idPresupuesto
 * de forma global (no por usuario).
 * Si quisieras por usuario, habría que filtrar por { user: this.user }
 * en el pre('save').
 */
const presupuestoSchema = new mongoose.Schema(
  {
    idPresupuesto: {
      type: Number, // Autoincremental
    },
    nombreObra: { type: String, required: true, trim: true },
    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cliente",
      required: true,
    },
    estado: {
      type: String,
      enum: ["pendiente", "aprobado", "perdido"],
      default: "pendiente",
    },
    empresaPerdida: { type: String, default: "" },
    totalPresupuestado: { type: Number, default: 0 },
    totalConFactura: { type: Number, default: 0 },
    totalSinFactura: { type: Number, default: 0 },
    direccion: { type: String, required: true, trim: true },
    fechaEntrega: { type: Date },
    descripcion: { type: String, trim: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

/**
 * Pre-save: si no existe idPresupuesto, buscamos el último
 * y sumamos 1. (Global; no por usuario)
 */
presupuestoSchema.pre("save", async function (next) {
  try {
    if (!this.idPresupuesto) {
      // Buscar el último presupuesto, ordenado desc por idPresupuesto
      const ultimo = await this.constructor
      .findOne({ user: this.user })
      .sort("-idPresupuesto");
    
      this.idPresupuesto = ultimo ? ultimo.idPresupuesto + 1 : 1;
    }
    next();
  } catch (err) {
    next(err);
  }
});

export default mongoose.model("Presupuesto", presupuestoSchema);

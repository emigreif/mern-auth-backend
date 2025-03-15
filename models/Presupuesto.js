// models/presupuesto.js
import mongoose from "mongoose";

const presupuestoSchema = new mongoose.Schema(
  {
    idPresupuesto: { type: Number },
    nombreObra: { type: String, required: true, trim: true },
    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cliente",
      required: true
    },
    estado: {
      type: String,
      enum: ["pendiente", "aprobado", "perdido"],
      default: "pendiente"
    },
    empresaPerdida: { type: String, default: "" },
    totalPresupuestado: { type: Number, default: 0 },
    totalConFactura: { type: Number, default: 0 },
    totalSinFactura: { type: Number, default: 0 },
    direccion: { type: String, required: true, trim: true },
    fechaEntrega: { type: Date },
    descripcion: { type: String, trim: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

/**
 * pre-save: si no existe idPresupuesto,
 * buscar el último de ese user y sumarle 1
 */
presupuestoSchema.pre("save", async function (next) {
  if (!this.idPresupuesto) {
    const ultimo = await this.constructor
      .findOne({ user: this.user })
      .sort("-idPresupuesto");
    this.idPresupuesto = ultimo ? ultimo.idPresupuesto + 1 : 1;
  }
  next();
});

export default mongoose.model("Presupuesto", presupuestoSchema);

// backend/models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    // Campos obligatorios
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },

    // Información adicional de facturación / empresa
    razonSocial: { type: String, default: "" },
    cuit: { type: String, default: "" },

    // Plan: referencia a un modelo "Plan"
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan" // Asegúrate de tener un modelo Plan con este nombre
    },

    // Estado del plan
    planStatus: {
      type: String,
      enum: ["pendiente", "activo", "vencido", "cancelado"],
      default: "pendiente"
    },

    // Fecha en la que expira el plan
    planExpiration: { type: Date },

    // Cantidad de perfiles o usuarios secundarios permitidos
    cantidadUsuarios: { type: Number, default: 1 },

    // Datos de ubicación
    direccion: { type: String, default: "" },
    localidad: { type: String, default: "" },
    codigoPostal: { type: String, default: "" },

    // Rol o privilegios
    esAdmin: { type: Boolean, default: false },

    // Campos para recuperación de contraseña
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);

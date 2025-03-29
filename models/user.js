// backend/models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    // Campos obligatorios
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    razonSocial: { type: String, default: "" },
    cuit: { type: String, default: "" },
    plan: { type: String, default: "" }, 
    cantidadUsuarios: { type: Number, default: 1 },
    direccion: { type: String, default: "" },
    localidad: { type: String, default: "" },
    codigoPostal: { type: String, default: "" },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);


//{type: mongoose.Schema.Types.ObjectId, ref: "Plan"}, // Asegúrate de tener un modelo Plan con este nombre mas adelante
    /*    
       planStatus: {
         type: String,
         enum: ["pendiente", "activo", "vencido", "cancelado"],
         default: "pendiente"
       },
       planExpiration: { type: Date }, */
// backend/models/OrderCounter.js
import mongoose from "mongoose";

// Un solo documento global para almacenar el último número de OC
const OrderCounterSchema = new mongoose.Schema({
  seq: { type: Number, default: 0 }, // Último correlativo usado
});

// Solo 1 documento en esta colección
export default mongoose.model("OrderCounter", OrderCounterSchema);

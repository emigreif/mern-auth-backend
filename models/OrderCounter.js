// models/orderCounter.js
import mongoose from "mongoose";

/**
 * Un solo documento global para almacenar el último número de OC
 * seq => correlativo actual
 */
const orderCounterSchema = new mongoose.Schema({
  seq: { type: Number, default: 0 }
});

export default mongoose.model("OrderCounter", orderCounterSchema);

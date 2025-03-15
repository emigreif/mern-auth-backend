// backend/utils/orderNumber.js
import OrderCounter from "../models/orderCounter.js";

/**
 * Obtiene el siguiente número de orden (seq) del documento único en OrderCounter
 *  - findOneAndUpdate({}, { $inc: { seq: 1 } }, { new: true, upsert: true })
 * @returns {Number} seq - El correlativo actual (ya incrementado)
 */
export async function getNextOrderNumber() {
  const doc = await OrderCounter.findOneAndUpdate(
    {},
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return doc.seq;
}

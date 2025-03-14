// backend/utils/orderNumber.js
import OrderCounter from "../models/OrderCounter.js";

export async function getNextOrderNumber() {
  const doc = await OrderCounter.findOneAndUpdate(
    {},
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  // doc.seq es el correlativo actual
  return doc.seq;
}

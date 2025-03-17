/* // backend/controllers/paymentController.js
import mercadopago from "../config/mercadoPago.js";
import User from "../models/user.js";

const PaymentController = {
  async webhook(req, res) {
    try {
      const { type, data } = req.body;
      if (type === "payment") {
        const paymentId = data.id;
        // En la versión 2.x:
        const payment = await mercadopago.payment.get(paymentId);

        if (payment?.body?.status === "approved") {
          const externalRef = payment.body.external_reference;
          const user = await User.findById(externalRef);
          if (user) {
            user.planStatus = "activo";
            user.planExpiration = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
            await user.save();
          }
        }
      }
      return res.sendStatus(200);
    } catch (error) {
      console.error("Error en webhook:", error);
      return res.sendStatus(500);
    }
  }
};

export default PaymentController;
 */
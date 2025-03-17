/* // backend/routes/paymentRoutes.js
import express from "express";
import PaymentController from "../controllers/paymentController.js";
const router = express.Router();

// Webhook => /api/payment/webhook
router.post("/webhook", PaymentController.webhook);

export default router;
/*  */ 
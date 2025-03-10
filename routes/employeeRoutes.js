// backend/routes/employeeRoutes.js
import express from "express";
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employeeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Podrías usar router.route("/") y router.route("/:id") para ser uniforme, 
// pero así también funciona.

router.get("/", protect, getEmployees);
router.post("/", protect, createEmployee);
router.get("/:id", protect, getEmployeeById);
router.put("/:id", protect, updateEmployee);
router.delete("/:id", protect, deleteEmployee);

export default router;

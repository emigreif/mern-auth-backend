// backend/routes/employeeRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
} from "../controllers/employeeController.js";

const router = express.Router();

/**
 * /api/employee => GET (listar), POST (crear)
 * /api/employee/:id => GET, PUT, DELETE
 */

router.get("/", protect, getEmployees);
router.post("/", protect, createEmployee);

router.get("/:id", protect, getEmployeeById);
router.put("/:id", protect, updateEmployee);
router.delete("/:id", protect, deleteEmployee);

export default router;

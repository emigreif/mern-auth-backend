import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,aplicarAumentoEmpleado,
  aplicarAumentoMasivo,
  updateSueldoIndividual
} from "../controllers/employeeController.js";

const router = express.Router();
router.patch("/:id/aumento", protect, aplicarAumentoEmpleado);
router.patch("/aumentos/masivo", protect, aplicarAumentoMasivo);

router.get("/", protect, getEmployees);
router.post("/", protect, createEmployee);
router.post("/aumento", protect, aplicarAumentoMasivo);
router.put("/sueldo/:id", protect, updateSueldoIndividual);
router.get("/:id", protect, getEmployeeById);
router.put("/:id", protect, updateEmployee);
router.delete("/:id", protect, deleteEmployee);

export default router;

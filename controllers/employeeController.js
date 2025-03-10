// backend/controllers/employeeController.js
import Employee from "../models/Employee.js";
import { getById, create, update, remove } from "./BaseController.js";

// GET con populate
export const getEmployees = async (req, res) => {
  try {
    // Filtra por el user
    const employees = await Employee.find({ user: req.user.id })
      .populate("user", "firstName lastName email");
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener empleados", error: error.message });
  }
};

export const getEmployeeById = getById(Employee);
export const createEmployee = create(Employee);
export const updateEmployee = update(Employee);
export const deleteEmployee = remove(Employee);

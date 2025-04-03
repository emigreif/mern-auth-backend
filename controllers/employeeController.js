// controllers/employeeController.js
import Employee from "../models/employee.js";
import { getById, create, update, remove } from "./baseController.js";

/**
 * GET con populate si deseas
 */
export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({ user: req.user.id }).populate(
      "user",
      "firstName lastName email"
    );
    res.json(employees);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener empleados", error: error.message });
  }
};
// controllers/employee.js

export const aplicarAumentoMasivo = async (req, res) => {
  const { aplicarA, tipo, valor } = req.body;
  const userId = req.user._id;

  const empleados = await Employee.find({ user: userId });

  const updated = await Promise.all(empleados.map(async (emp) => {
    let blanco = emp.salarioRegistrado;
    let negro = emp.salarioNoRegistrado;

    if (aplicarA === "blanco" || aplicarA === "ambos") {
      blanco = tipo === "porcentaje"
        ? blanco * (1 + valor / 100)
        : blanco + valor;
    }

    if (aplicarA === "negro" || aplicarA === "ambos") {
      negro = tipo === "porcentaje"
        ? negro * (1 + valor / 100)
        : negro + valor;
    }

    const total = blanco + negro;

    return Employee.findByIdAndUpdate(emp._id, {
      salario: total,
      salarioRegistrado: blanco,
      salarioNoRegistrado: negro
    }, { new: true });
  }));

  res.json({ message: "Aumento aplicado correctamente", updated });
};


export const getEmployeeById = getById(Employee);
export const createEmployee = create(Employee);
export const updateEmployee = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user._id;
    const data = req.body;

    // Buscar empleado del usuario
    const emp = await Employee.findOne({ _id: id, user: userId });
    if (!emp) return res.status(404).json({ message: "Empleado no encontrado" });

    // LOGICA DE CONSISTENCIA
    if (data.salario != null && data.salarioRegistrado != null) {
      data.salarioNoRegistrado = data.salario - data.salarioRegistrado;
    } else if (data.salario != null && data.salarioNoRegistrado != null) {
      data.salarioRegistrado = data.salario - data.salarioNoRegistrado;
    } else if (data.salarioRegistrado != null && data.salarioNoRegistrado != null) {
      data.salario = data.salarioRegistrado + data.salarioNoRegistrado;
    }

    const updated = await Employee.findByIdAndUpdate(id, data, {
      new: true
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar", error: err.message });
  }
};

export const deleteEmployee = remove(Employee);

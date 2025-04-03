import Employee from "../models/employee.js";
import { getById, create, update, remove } from "./baseController.js";

export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({ user: req.user.id });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener empleados", error: error.message });
  }
};

export const aplicarAumentoMasivo = async (req, res) => {
  const { aplicarA, tipo, valor } = req.body;
  const userId = req.user._id;

  const empleados = await Employee.find({ user: userId });

  const updated = await Promise.all(empleados.map(async (emp) => {
    let blanco = emp.salarioRegistrado;
    let negro = emp.salarioNoRegistrado;

    if (aplicarA === "blanco" || aplicarA === "ambos") {
      blanco = tipo === "porcentaje" ? blanco * (1 + valor / 100) : blanco + valor;
    }

    if (aplicarA === "negro" || aplicarA === "ambos") {
      negro = tipo === "porcentaje" ? negro * (1 + valor / 100) : negro + valor;
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

export const updateSueldoIndividual = async (req, res) => {
  const { salarioRegistrado, salarioNoRegistrado } = req.body;
  const total = salarioRegistrado + salarioNoRegistrado;

  const updated = await Employee.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    {
      salario: total,
      salarioRegistrado,
      salarioNoRegistrado
    },
    { new: true }
  );

  res.json(updated);
};

export const getEmployeeById = getById(Employee);
export const createEmployee = create(Employee);
export const updateEmployee = update(Employee);
export const deleteEmployee = remove(Employee);

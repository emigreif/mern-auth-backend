import Employee from "../models/employee.js";
import { getById, create, update, remove } from "./baseController.js";
import {
  assertValidId,
  handleMongooseError
} from "../utils/validationHelpers.js";

// Listar empleados
export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({ user: req.user.id });
    res.json(employees);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

// Aumento masivo a todos los empleados
export const aplicarAumentoMasivo = async (req, res) => {
  try {
    const { aplicarA, tipo, valor } = req.body;
    const userId = req.user._id;

    const empleados = await Employee.find({ user: userId });

    const updated = await Promise.all(
      empleados.map(async (emp) => {
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
      })
    );

    res.json({ message: "Aumento aplicado correctamente", updated });
  } catch (error) {
    handleMongooseError(res, error);
  }
};

// Actualizar sueldo individual
export const updateSueldoIndividual = async (req, res) => {
  try {
    const { salarioRegistrado, salarioNoRegistrado } = req.body;
    const { id } = req.params;

    assertValidId(id, "Empleado");

    const total = salarioRegistrado + salarioNoRegistrado;

    const updated = await Employee.findOneAndUpdate(
      { _id: id, user: req.user._id },
      {
        salario: total,
        salarioRegistrado,
        salarioNoRegistrado
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }

    res.json(updated);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

// Aumento individual a un empleado
export const aplicarAumentoEmpleado = async (req, res) => {
  try {
    const { aplicarA, tipo, valor } = req.body;
    const { id } = req.params;
    const userId = req.user._id;

    assertValidId(id, "Empleado");

    const emp = await Employee.findOne({ _id: id, user: userId });
    if (!emp) return res.status(404).json({ message: "Empleado no encontrado" });

    let blanco = emp.salarioRegistrado;
    let negro = emp.salarioNoRegistrado;

    if (aplicarA === "blanco" || aplicarA === "ambos") {
      blanco = tipo === "porcentaje" ? blanco * (1 + valor / 100) : blanco + valor;
    }

    if (aplicarA === "negro" || aplicarA === "ambos") {
      negro = tipo === "porcentaje" ? negro * (1 + valor / 100) : negro + valor;
    }

    emp.salarioRegistrado = blanco;
    emp.salarioNoRegistrado = negro;
    emp.salario = blanco + negro;

    await emp.save();

    res.json({ message: "Aumento aplicado", empleado: emp });
  } catch (error) {
    handleMongooseError(res, error);
  }
};

// CRUD básico
export const getEmployeeById = getById(Employee);
export const createEmployee = create(Employee);
export const updateEmployee = update(Employee);
export const deleteEmployee = remove(Employee);

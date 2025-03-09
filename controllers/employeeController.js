import Employee from "../models/Employee.js";

// 📌 Obtener todos los empleados
export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().populate("user", "nombre email");
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener empleados" });
  }
};

// 📌 Obtener un solo empleado por ID
export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: "Empleado no encontrado" });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener empleado" });
  }
};

// 📌 Crear un nuevo empleado
export const createEmployee = async (req, res) => {
  try {
    const { nombre, apellido, dni, email, telefono, direccion, puesto, salario, fechaIngreso, activo } = req.body;
    
    const newEmployee = new Employee({
      nombre,
      apellido,
      dni,
      email,
      telefono,
      direccion,
      puesto,
      salario,
      fechaIngreso,
      activo,
      user: req.user.id, // El usuario que lo está creando
    });

    const savedEmployee = await newEmployee.save();
    res.status(201).json(savedEmployee);
  } catch (error) {
    res.status(500).json({ message: "Error al crear empleado" });
  }
};

// 📌 Actualizar empleado
export const updateEmployee = async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEmployee) return res.status(404).json({ message: "Empleado no encontrado" });
    res.json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar empleado" });
  }
};

// 📌 Eliminar empleado
export const deleteEmployee = async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) return res.status(404).json({ message: "Empleado no encontrado" });
    res.json({ message: "Empleado eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar empleado" });
  }
};

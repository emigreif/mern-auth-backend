import Cliente from "../models/Cliente.js";

// 📌 Obtener todos los clientes del usuario
export const listarClientes = async (req, res) => {
  try {
    const clientes = await Cliente.find({ user: req.user.id }).populate("obras");
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener clientes", error: error.message });
  }
};

// 📌 Obtener un cliente por ID
export const obtenerCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findOne({ _id: req.params.id, user: req.user.id });
    if (!cliente) return res.status(404).json({ message: "Cliente no encontrado" });
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el cliente", error: error.message });
  }
};

// 📌 Crear un nuevo cliente (usado desde Clientes y desde Obra/Presupuesto)
export const crearCliente = async (req, res) => {
  try {
    const nuevoCliente = new Cliente({ ...req.body, user: req.user.id });
    const clienteGuardado = await nuevoCliente.save();
    res.status(201).json({ message: "Cliente creado correctamente", cliente: clienteGuardado });
  } catch (error) {
    res.status(400).json({ message: "Error al crear cliente", error: error.message });
  }
};

// 📌 Actualizar un cliente
export const actualizarCliente = async (req, res) => {
  try {
    const clienteActualizado = await Cliente.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!clienteActualizado) return res.status(404).json({ message: "Cliente no encontrado" });
    res.json(clienteActualizado);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar cliente", error: error.message });
  }
};

// 📌 Eliminar un cliente
export const eliminarCliente = async (req, res) => {
  try {
    const clienteEliminado = await Cliente.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!clienteEliminado) return res.status(404).json({ message: "Cliente no encontrado" });
    res.json({ message: "Cliente eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar cliente", error: error.message });
  }
};

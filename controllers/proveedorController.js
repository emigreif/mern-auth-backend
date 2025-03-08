import Proveedor from "../models/Proveedor.js";

// 🔹 Listar proveedores
export const listarProveedores = async (req, res) => {
  try {
    const proveedores = await Proveedor.find({ user: req.user.id });
    res.json(proveedores);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener proveedores", error: error.message });
  }
};

// 🔹 Obtener un proveedor por ID
export const obtenerProveedor = async (req, res) => {
  try {
    const proveedor = await Proveedor.findOne({ _id: req.params.id, user: req.user.id });
    if (!proveedor) return res.status(404).json({ message: "Proveedor no encontrado" });
    res.json(proveedor);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener proveedor", error: error.message });
  }
};

// 🔹 Crear un nuevo proveedor
export const crearProveedor = async (req, res) => {
  try {
    const nuevoProveedor = new Proveedor({ ...req.body, user: req.user.id });
    const proveedorGuardado = await nuevoProveedor.save();
    res.status(201).json(proveedorGuardado);
  } catch (error) {
    res.status(400).json({ message: "Error al crear proveedor", error: error.message });
  }
};

// 🔹 Actualizar un proveedor
export const actualizarProveedor = async (req, res) => {
  try {
    const proveedorActualizado = await Proveedor.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!proveedorActualizado) return res.status(404).json({ message: "Proveedor no encontrado" });
    res.json(proveedorActualizado);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar proveedor", error: error.message });
  }
};

// 🔹 Eliminar un proveedor
export const eliminarProveedor = async (req, res) => {
  try {
    const proveedorEliminado = await Proveedor.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!proveedorEliminado) return res.status(404).json({ message: "Proveedor no encontrado" });
    res.json({ message: "Proveedor eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar proveedor", error: error.message });
  }
};

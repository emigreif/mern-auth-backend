import Panol from "../models/Panol.js";

// 🔹 Obtener el estado del pañol
export const obtenerPanol = async (req, res) => {
  try {
    let panol = await Panol.findOne({ user: req.user.id });
    if (!panol) {
      panol = new Panol({ user: req.user.id });
      await panol.save();
    }
    res.json(panol);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener pañol", error: error.message });
  }
};

// 🔹 Agregar un elemento al pañol (herramienta, perfil, accesorio, vidrio)
export const agregarElemento = async (req, res) => {
  const { tipo } = req.params;
  const elementosValidos = ["herramientas", "perfiles", "accesorios", "vidrios"];
  if (!elementosValidos.includes(tipo)) return res.status(400).json({ message: "Tipo inválido" });

  try {
    let panol = await Panol.findOne({ user: req.user.id });
    if (!panol) panol = new Panol({ user: req.user.id });

    panol[tipo].push(req.body);
    await panol.save();

    res.status(201).json(panol[tipo][panol[tipo].length - 1]);
  } catch (error) {
    res.status(400).json({ message: "Error al agregar elemento", error: error.message });
  }
};

// 🔹 Eliminar un elemento del pañol
export const eliminarElemento = async (req, res) => {
  const { tipo, id } = req.params;
  const elementosValidos = ["herramientas", "perfiles", "accesorios", "vidrios"];
  if (!elementosValidos.includes(tipo)) return res.status(400).json({ message: "Tipo inválido" });

  try {
    let panol = await Panol.findOne({ user: req.user.id });
    if (!panol) return res.status(404).json({ message: "Pañol no encontrado" });

    panol[tipo] = panol[tipo].filter((item) => item._id.toString() !== id);
    await panol.save();

    res.json({ message: `${tipo.slice(0, -1)} eliminado correctamente` });
  } catch (error) {
    res.status(400).json({ message: "Error al eliminar elemento", error: error.message });
  }
};

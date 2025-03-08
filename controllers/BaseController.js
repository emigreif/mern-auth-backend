export const getAll = (Model) => async (req, res) => {
  try {
    const data = await Model.find({ user: req.user.id });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener datos", error: error.message });
  }
};

export const getById = (Model) => async (req, res) => {
  try {
    const data = await Model.findOne({ _id: req.params.id, user: req.user.id });
    if (!data) return res.status(404).json({ message: "No encontrado" });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener dato", error: error.message });
  }
};

export const create = (Model) => async (req, res) => {
  try {
    const newItem = new Model({ ...req.body, user: req.user.id });
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ message: "Error al crear", error: error.message });
  }
};

export const update = (Model) => async (req, res) => {
  try {
    const updatedItem = await Model.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!updatedItem) return res.status(404).json({ message: "No encontrado" });
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar", error: error.message });
  }
};

export const remove = (Model) => async (req, res) => {
  try {
    const deletedItem = await Model.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!deletedItem) return res.status(404).json({ message: "No encontrado" });
    res.json({ message: "Eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar", error: error.message });
  }
};

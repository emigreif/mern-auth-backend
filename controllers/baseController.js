import {
  assertValidId,
  handleMongooseError
} from "../utils/validationHelpers.js";

export const getAll = (Model) => async (req, res) => {
  try {
    const data = await Model.find({ user: req.user.id });
    res.json(data);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

export const getById = (Model) => async (req, res) => {
  try {
    const { id } = req.params;
    assertValidId(id);

    const data = await Model.findOne({ _id: id, user: req.user.id });
    if (!data) return res.status(404).json({ message: "No encontrado" });

    res.json(data);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

export const create = (Model) => async (req, res) => {
  try {
    const newItem = new Model({ ...req.body, user: req.user.id });
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

export const update = (Model) => async (req, res) => {
  try {
    const { id } = req.params;
    assertValidId(id);

    const updatedItem = await Model.findOneAndUpdate(
      { _id: id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!updatedItem) return res.status(404).json({ message: "No encontrado" });

    res.json(updatedItem);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

export const remove = (Model) => async (req, res) => {
  try {
    const { id } = req.params;
    assertValidId(id);

    const deletedItem = await Model.findOneAndDelete({
      _id: id,
      user: req.user.id
    });

    if (!deletedItem) return res.status(404).json({ message: "No encontrado" });

    res.json({ message: "Eliminado correctamente" });
  } catch (error) {
    handleMongooseError(res, error);
  }
};

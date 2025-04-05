import mongoose from "mongoose";

/**
 * Valida que el ID sea un ObjectId válido
 */
export const isValidMongoId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

/**
 * Lanza un error si el ID no es válido
 */
export const assertValidId = (id, name = "ID") => {
  if (!isValidMongoId(id)) {
    const error = new Error(`${name} no es un ID válido`);
    error.statusCode = 400;
    throw error;
  }
};

/**
 * Intenta buscar un documento por ID, lanza error si no existe
 */
export const findByIdOrFail = async (Model, id, modelName = "Recurso") => {
  const doc = await Model.findById(id);
  if (!doc) {
    const error = new Error(`${modelName} no encontrado con ID: ${id}`);
    error.statusCode = 404;
    throw error;
  }
  return doc;
};

/**
 * Maneja errores de Mongoose: validaciones, duplicados, etc.
 */
export const handleMongooseError = (res, error) => {
  console.error("🛑 Mongoose Error:", error);

  if (error.name === "ValidationError") {
    return res.status(400).json({
      message: "Error de validación",
      errors: Object.values(error.errors).map((e) => e.message),
    });
  }

  if (error.code === 11000) {
    return res.status(409).json({
      message: "Ya existe un registro con ese valor único",
      conflict: error.keyValue,
    });
  }

  // Error por default
  return res.status(error.statusCode || 500).json({
    message: error.message || "Error interno del servidor",
  });
};

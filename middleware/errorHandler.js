/* export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ message: err.message || "Error en el servidor" });
  };
   */
  // backend/middleware/errorHandler.js
import mongoose from "mongoose";

export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Manejo de errores de validación de Mongoose
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      message: "Error de validación",
      errors: err.errors, // Detalles de cada campo
    });
  }

  // Manejo de otros errores (por ejemplo, cast errors)
  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      message: `Valor inválido para el campo ${err.path}: ${err.value}`,
    });
  }

  // Por defecto, error 500
  res.status(err.status || 500).json({
    message: err.message || "Error en el servidor",
  });
};

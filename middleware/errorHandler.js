// middleware/errorHandler.js
import mongoose from "mongoose";

/**
 * Manejo global de errores.
 *  - Errores de validación de Mongoose => 400
 *  - Errores de Cast => 400
 *  - Por defecto => 500
 */
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Manejo de errores de validación de Mongoose
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      message: "Error de validación",
      errors: err.errors
    });
  }

  // Manejo de errores de Cast
  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      message: `Valor inválido para el campo ${err.path}: ${err.value}`
    });
  }

  // Por defecto, error 500
  res.status(err.status || 500).json({
    message: err.message || "Error en el servidor"
  });
};

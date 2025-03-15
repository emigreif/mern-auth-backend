// db.js
import mongoose from "mongoose";
import dotenv from "dotenv";

// Cargamos variables de entorno
dotenv.config();

// Ajuste para Mongoose 6 (opcional, suprime warnings antiguos)
mongoose.set("strictQuery", false);

/**
 * Conexión a la base de datos.
 * Se eliminan las opciones obsoletas useNewUrlParser y useUnifiedTopology,
 * ya que Mongoose 6+ las usa por defecto.
 */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;

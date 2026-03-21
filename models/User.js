import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  rol: { type: String, required: true },
  estado: { type: String, required: true, enum: ['Activo', 'Inactivo'], default: 'Activo' },
  password: { type: String, required: true }
});

export default mongoose.model("User", userSchema, "Usuarios");

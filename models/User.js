import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  rol: { type: String, required: true },
  password: { type: String, required: true }
});

// the third argument forces the collection name used by mongoose. Atlas
// already contains a "Usuarios" collection so we must match it explicitly.
export default mongoose.model("User", userSchema, "Usuarios");

import mongoose from "mongoose";

const insumoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    cantidad: { type: Number, required: true },
    cantidadMinima: { type: Number, required: true },
    medida: { type: String, required: true }
});

export default mongoose.model("Insumo", insumoSchema, "Insumos");
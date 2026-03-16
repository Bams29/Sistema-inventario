import mongoose from "mongoose";

const reciboSchema = new mongoose.Schema({
    valor: { type: String, required: true },
    cantidades: { type: String, required: true },
    empleado: { type: String, required: true },
    fecha: { type: String, required: true },
    insumos: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model("Recibo", reciboSchema, "Recibos");

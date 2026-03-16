import mongoose from "mongoose";

const avisoSchema = new mongoose.Schema({
    producto_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Insumo', required: true },
    Nombre_producto: { type: String, required: true },
    fecha: { type: String, required: true },
    mensaje: { type: String },
    aviso_id: { type: String, unique: true }
}, { timestamps: true });

// guardamos esta información en la colección AvisosInsumos (tu nombre objetivo)
export default mongoose.model("Aviso", avisoSchema, "AvisosInsumos");

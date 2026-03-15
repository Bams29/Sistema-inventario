import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";
import Insumo from "./models/Insumo.js";

// load env vars
dotenv.config();

// wrap startup in an async IIFE so we can await DB connection and
// optionally perform initialization queries before starting the HTTP server.
(async function main() {
  try {
    await connectDB();

    // count users so we can warn if the collection is empty
    const userCount = await User.countDocuments();
    console.log(`Usuarios en la colección: ${userCount}`);

    if (userCount === 0) {
      // create a default admin account for first-time setup
      await User.create({ nombre: 'admin', password: 'admin123', rol: 'admin' });
      console.log('Usuario por defecto creado: admin / admin123');
    }

    const app = express();
    app.use(cors()); // Habilitar CORS
    app.use(express.json()); // parse JSON bodies
    app.use(express.static('.')); // Servir archivos estáticos del directorio actual

    // simple login endpoint
    app.post("/api/login", async (req, res) => {
      const { usuario, clave } = req.body;

      if (!usuario || !clave) {
        return res.status(400).json({ message: "Faltan credenciales" });
      }

      try {
        // match against the collection you described
        const user = await User.findOne({ nombre: usuario, password: clave });

        if (!user) {
          return res.status(401).json({ message: "Credenciales incorrectas" });
        }

        // you can return additional data (JWT, rol, etc.)
        return res.json({ success: true, rol: user.rol });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error del servidor" });
      }
    });

    // registration endpoint (optional)
    app.post('/api/register', async (req, res) => {
      const { nombre, password, rol } = req.body;
      if (!nombre || !password) {
        return res.status(400).json({ message: 'Nombre y contraseña requeridos' });
      }
      try {
        const existing = await User.findOne({ nombre });
        if (existing) {
          return res.status(409).json({ message: 'El usuario ya existe' });
        }
        const newUser = await User.create({ nombre, password, rol: rol || 'user' });
        return res.status(201).json({ message: 'Usuario creado', id: newUser._id });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al crear usuario' });
      }
    });

    // Insumos CRUD endpoints
    // GET /api/insumos - fetch all insumos
    app.get('/api/insumos', async (req, res) => {
      try {
        const insumos = await Insumo.find();
        res.json(insumos);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener insumos' });
      }
    });

    // POST /api/insumos - create new insumo
    app.post('/api/insumos', async (req, res) => {
      const { nombre, cantidad, cantidadMinima, medida } = req.body;
      if (!nombre || cantidad == null || cantidadMinima == null || !medida) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
      }
      try {
        const newInsumo = await Insumo.create({ nombre, cantidad, cantidadMinima, medida });
        res.status(201).json(newInsumo);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al crear insumo' });
      }
    });

    // PUT /api/insumos/:id - update insumo
    app.put('/api/insumos/:id', async (req, res) => {
      const { id } = req.params;
      const { nombre, cantidad, cantidadMinima, medida } = req.body;
      try {
        const updated = await Insumo.findByIdAndUpdate(id, { nombre, cantidad, cantidadMinima, medida }, { new: true });
        if (!updated) return res.status(404).json({ message: 'Insumo no encontrado' });
        res.json(updated);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al actualizar insumo' });
      }
    });

    // DELETE /api/insumos/:id - delete insumo
    app.delete('/api/insumos/:id', async (req, res) => {
      const { id } = req.params;
      try {
        const deleted = await Insumo.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: 'Insumo no encontrado' });
        res.json({ message: 'Insumo eliminado' });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al eliminar insumo' });
      }
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Servidor arrancado en puerto ${PORT}`));
  } catch (err) {
    console.error('Inicio fallido:', err);
    process.exit(1);
  }
})();
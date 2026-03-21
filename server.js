import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";
import Insumo from "./models/Insumo.js";
import Aviso from "./models/Aviso.js";
import Recibo from "./models/Recibo.js";

// load env vars
dotenv.config();

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

    // Users CRUD endpoints
    // GET /api/users - fetch all users
    app.get('/api/users', async (req, res) => {
      try {
        const users = await User.find();
        res.json(users);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener usuarios' });
      }
    });

    // POST /api/users - create new user
    app.post('/api/users', async (req, res) => {
      const { nombre, password, rol, estado } = req.body;
      if (!nombre || !password) {
        return res.status(400).json({ message: 'Nombre y contraseña requeridos' });
      }
      try {
        const existing = await User.findOne({ nombre });
        if (existing) {
          return res.status(409).json({ message: 'El usuario ya existe' });
        }
        const newUser = await User.create({ nombre, password, rol: rol || 'Empleado', estado });
        res.status(201).json(newUser);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al crear usuario' });
      }
    });

    // PUT /api/users/:id - update user
    app.put('/api/users/:id', async (req, res) => {
      const { id } = req.params;
      const { nombre, password, rol, estado } = req.body;
      try {
        const updated = await User.findByIdAndUpdate(id, { nombre, password, rol, estado }, { new: true });
        if (!updated) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.json(updated);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al actualizar usuario' });
      }
    });

    // DELETE /api/users/:id - delete user
    app.delete('/api/users/:id', async (req, res) => {
      const { id } = req.params;
      try {
        const deleted = await User.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.json({ message: 'Usuario eliminado' });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al eliminar usuario' });
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
        await checkLowStockAndCreateAviso(newInsumo);
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
        await checkLowStockAndCreateAviso(updated);
        res.json(updated);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al actualizar insumo' });
      }
    });

    // Function to check low stock and create aviso if needed
    async function checkLowStockAndCreateAviso(insumo) {
      if (Number(insumo.cantidad) < Number(insumo.cantidadMinima)) {
        try {
          const fecha = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
          const avisoId = `AVISO-${fecha}-${insumo._id.toString().slice(-4)}`;
          const mensaje = `${insumo.nombre} bajo stock mínimo: ${insumo.cantidad} ${insumo.medida} (mínimo: ${insumo.cantidadMinima})`;

          // evita duplicados por mismo producto/fecha
          const existing = await Aviso.findOne({ producto_id: insumo._id, fecha });
          if (existing) {
            return;
          }

          await Aviso.create({
            producto_id: insumo._id,
            Nombre_producto: insumo.nombre,
            fecha,
            mensaje,
            aviso_id: avisoId
          });
          console.log(`Aviso creado para ${insumo.nombre}:`, avisoId);
        } catch (avisoErr) {
          console.error('Error creating low stock aviso:', avisoErr);
        }
      }
    }

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

    // Avisos CRUD endpoints
    // GET /api/avisos - fetch all avisos
    app.get('/api/avisos', async (req, res) => {
      try {
        const avisos = await Aviso.find();
        res.json(avisos);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener avisos' });
      }
    });

    // POST /api/avisos - create new aviso
    app.post('/api/avisos', async (req, res) => {
      const { producto_id, Nombre_producto, fecha, mensaje } = req.body;
      if (!producto_id || !Nombre_producto || !fecha) {
        return res.status(400).json({ message: 'producto_id, Nombre_producto y fecha son requeridos' });
      }
      try {
        const avisoId = `AVISO-${fecha}-${Date.now()}`;
        const newAviso = await Aviso.create({
          producto_id,
          Nombre_producto,
          fecha,
          mensaje: mensaje || `${Nombre_producto} con stock bajo`,
          aviso_id: avisoId
        });
        res.status(201).json(newAviso);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al crear aviso' });
      }
    });

    // PUT /api/avisos/:id - update aviso
    app.put('/api/avisos/:id', async (req, res) => {
      const { id } = req.params;
      const { valor, cantidades, empleado, fecha, insumos } = req.body;
      try {
        const updated = await Aviso.findByIdAndUpdate(id, { valor, cantidades, empleado, fecha, insumos }, { new: true });
        if (!updated) return res.status(404).json({ message: 'Aviso no encontrado' });
        res.json(updated);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al actualizar aviso' });
      }
    });

    // DELETE /api/avisos/:id - delete aviso
    app.delete('/api/avisos/:id', async (req, res) => {
      const { id } = req.params;
      try {
        const deleted = await Aviso.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: 'Aviso no encontrado' });
        res.json({ message: 'Aviso eliminado' });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al eliminar aviso' });
      }
    });

    // Recibos CRUD endpoints
    // GET /api/recibos
    app.get('/api/recibos', async (req, res) => {
      try {
        const recibos = await Recibo.find();
        res.json(recibos);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener recibos' });
      }
    });

    // POST /api/recibos
    app.post('/api/recibos', async (req, res) => {
      const { valor, cantidades, empleado, fecha, insumos } = req.body;
      if (!valor || !cantidades || !empleado || !fecha || !insumos) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
      }
      try {
        const newRecibo = await Recibo.create({ valor, cantidades, empleado, fecha, insumos });
        res.status(201).json(newRecibo);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al crear recibo' });
      }
    });

    // PUT /api/recibos/:id
    app.put('/api/recibos/:id', async (req, res) => {
      const { id } = req.params;
      const { valor, cantidades, empleado, fecha, insumos } = req.body;
      try {
        const updated = await Recibo.findByIdAndUpdate(id, { valor, cantidades, empleado, fecha, insumos }, { new: true });
        if (!updated) return res.status(404).json({ message: 'Recibo no encontrado' });
        res.json(updated);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al actualizar recibo' });
      }
    });

    // DELETE /api/recibos/:id
    app.delete('/api/recibos/:id', async (req, res) => {
      const { id } = req.params;
      try {
        const deleted = await Recibo.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: 'Recibo no encontrado' });
        res.json({ message: 'Recibo eliminado' });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al eliminar recibo' });
      }
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Servidor arrancado en puerto ${PORT}`));
  } catch (err) {
    console.error('Inicio fallido:', err);
    process.exit(1);
  }
})();
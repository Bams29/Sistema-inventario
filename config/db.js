import mongoose from "mongoose";
export const connectDB = async () => {
    try {
        // if the URI does not include a database name, mongoose will default to "test".
        // read an explicit name from env so we can connect to "SistemaInventario".
        const options = {};
        if (process.env.MONGODB_NAME) {
            options.dbName = process.env.MONGODB_NAME;
        }
        await mongoose.connect(process.env.MONGODB_URI, options);
        console.log("Conexión a la base de datos establecida");
    } catch (error) {
        console.error("Error al conectar a la base de datos:", error.message);
        process.exit(1);
    }
};
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const options = {};

    if (process.env.MONGODB_NAME) {
      options.dbName = process.env.MONGODB_NAME;
    }

    // Render no carga tu .env local, así que verificamos variables de entorno
    const uri =
      process.env.MONGODB_URI ||
      process.env.MONGODB_URL ||
      process.env.MONGODB_CONNECTION_STRING;

    if (!uri || typeof uri !== "string") {
      console.error(
        "Error: falta la URI de MongoDB. Define en Render una variable de entorno como:",
      );
      console.error("- MONGODB_URI (recomendado)");
      console.error("- MONGODB_URL");
      console.error("- MONGODB_CONNECTION_STRING");
      console.error("Recibido MONGODB_URI:", process.env.MONGODB_URI);
      process.exit(1);
    }

    await mongoose.connect(uri, options);
    console.log("Conexión a la base de datos establecida");
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error.message);
    process.exit(1);
  }
};

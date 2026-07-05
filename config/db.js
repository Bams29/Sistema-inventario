import mongoose from "mongoose";

const getMongoUri = () => {
  const candidateVars = [
    process.env.MONGODB_URI,
    process.env.MONGODB_URL,
    process.env.MONGODB_CONNECTION_STRING,
    process.env.MONGO_URI,
    process.env.MONGO_URL,
    process.env.DATABASE_URL,
  ];

  return candidateVars.find(
    (value) => typeof value === "string" && value.trim() !== "",
  );
};

export const connectDB = async () => {
  try {
    const options = {};

    if (process.env.MONGODB_NAME) {
      options.dbName = process.env.MONGODB_NAME;
    }

    const uri = getMongoUri();

    if (!uri) {
      console.error(
        "Error: falta la URI de MongoDB. Define en Render una variable de entorno con uno de estos nombres:",
      );
      console.error("- MONGODB_URI (recomendado)");
      console.error("- MONGODB_URL");
      console.error("- MONGODB_CONNECTION_STRING");
      console.error("- MONGO_URI");
      console.error("- MONGO_URL");
      console.error("- DATABASE_URL");
      console.error(
        "Ejemplo: mongodb+srv://<usuario>:<password>@cluster.mongodb.net/inventario",
      );
      process.exit(1);
    }

    await mongoose.connect(uri, options);
    console.log("Conexión a la base de datos establecida");
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error.message);
    process.exit(1);
  }
};

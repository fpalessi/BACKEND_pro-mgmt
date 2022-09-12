import mongoose from "mongoose";

const DBconnect = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const url = `${connection.connection.host}:${connection.connection.port}`;
    console.log(`MongoDB Conectado en : ${url}`);
  } catch (error) {
    console.log(`error: ${error.message}`);
    proccess.exit(1);
  }
};
export default DBconnect;

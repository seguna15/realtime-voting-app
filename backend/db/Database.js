import mongoose from "mongoose";

const connectDatabase = async () => {
  const data = await mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log(`Mongodb connected with server: ${data.connection.host}`);
};

export default connectDatabase;

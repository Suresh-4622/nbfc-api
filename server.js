import mongoose from "mongoose";
const { connect } = mongoose;
import { config } from "dotenv";

config({
  path: "./.env",
});

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION!!! shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});
import app from "./app.js";

const database = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);

// Connect to the database
connect(database, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then((con) => {
  console.log("Database Connected Successfully");
});

// Start Server
const port = process.env.PORT || 3004;
app.listen(port, () => {
  console.log(`Application is running on port ${port}`);
});

//Close Server
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION!!! shutting down ...");
  console.log(err.name, err.message);
});

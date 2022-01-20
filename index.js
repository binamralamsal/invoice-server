import express, { json } from "express";
import userRoutes from "./routes/userRoutes.js";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

import "dotenv/config.js";

// Connect to database
connectDB();

const app = express();

app.use(json());

// Routes
app.use("/api/users", userRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8008;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

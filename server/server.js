import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js'; // ✅ ESM import
import cors from 'cors';
import authRoutes from './routes/auth.js'; // ✅ ESM import
import projectRoutes from './routes/projects.js'
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

connectDB();
app.use(cors());
app.use(express.json());
app.use(authRoutes);
app.use(projectRoutes);

app.listen(PORT, () => {
  console.log("Server running on port:", PORT);
});

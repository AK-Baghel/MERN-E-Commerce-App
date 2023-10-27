// If you want to use Import instead of require, just add type:module in package.json

import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoutes from "./routes/authRoute.js"

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(morgan('dev'))


app.use('/api/v1/auth', authRoutes);

app.get("/", (req, resp) => {
    resp.send("hello")
})

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
})
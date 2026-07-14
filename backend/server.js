import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import urlRoutes from './routes/url.js';

dotenv.config();

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'https://url-shortener-app-lemon.vercel.app',
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || /^https:\/\/.+\.vercel\.app$/i.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options(/(.*)/, cors(corsOptions));
app.use(express.json());

app.use("/", urlRoutes);

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('Connected to MongoDB');
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
})
.catch((err) => {
  console.log("Error connecting to MongoDB:", err);
});


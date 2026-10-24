import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { router } from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

export const app = express();

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());

// Mount API routes
app.use('/', router);

// Error handling middleware
app.use(errorHandler);

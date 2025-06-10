import cluster from 'cluster';
import os from 'os';
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cron from 'node-cron';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';

import userRoutes from './src/routes/user-routes.js';
import authRoutes from './src/routes/auth-route.js';
import adminRoutes from './src/routes/admin-route.js';
import amb from './src/routes/ambassador-nomination-route.js';
import ambassador from './src/routes/ambassador-route.js';
import registeration from './src/routes/registeration-route.js';
import accommodations from './src/routes/accommodations-route.js';
import invites from './src/routes/invitations-route.js';
import publicRoutes from './src/routes/public-route.js';
import registrationAgent from './src/routes/registrationAgent-route.js';
import societyRoutes from './src/routes/societies-route.js';
import { updateParticipantDetails } from './src/controllers/society-controller.js';

const numCPUs = os.cpus().length;

if (cluster.isPrimary && numCPUs > 1) {
  console.log(`Primary ${process.pid} is running — forking ${numCPUs} workers`);
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.warn(
      `Worker ${worker.process.pid} died (code=${code}, signal=${signal}). Spawning a new one.`
    );
    cluster.fork();
  });
} else {
  // Load env vars
  const envFile =
    process.env.NODE_ENV === 'production' ? '.env.production' : '.env.staging';
  dotenv.config({ path: envFile });

  const app = express();

  // Security headers
  app.use(helmet());

  // CORS setup
  const allowedOrigins =
    process.env.NODE_ENV === 'production'
      ? ['https://daira.pk']
      : ['https://dev.daira.pk', 'http://localhost:5173'];
  app.use(
    cors({
      origin(origin, cb) {
        if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
        cb(new Error('Not allowed by CORS'));
      },
      optionsSuccessStatus: 200,
      credentials: true,
    })
  );

  // Body parsers
  app.use(express.json({ limit: '30mb', extended: true }));
  app.use(express.urlencoded({ limit: '100mb', extended: true }));

  // Rate limiter
  const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 200,
    message: 'Too many requests, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Database connection
  mongoose
    .connect(process.env.MONGO, { maxPoolSize: 5 })
    .then(() => console.log('Connected to Database'))
    .catch(console.error);

  // Health check
  app.get('/health', limiter, (req, res) => res.status(200).send('OK'));

  // Routes
  app.use('/backend/user/', limiter, userRoutes);
  app.use('/backend/auth/', limiter, authRoutes);
  app.use('/backend/ambassador-nomination/', limiter, amb);
  app.use('/backend/admin', limiter, adminRoutes);
  app.use('/backend/ambassador/', limiter, ambassador);
  app.use('/backend/invitations/', limiter, invites);
  app.use('/backend/registeration/', limiter, registeration);
  app.use('/backend/societies/', limiter, societyRoutes);
  app.use('/backend/public/', limiter, publicRoutes);
  app.use('/backend/agent/', limiter, registrationAgent);
  app.use('/backend/accommodations/', limiter, accommodations);

  // Cron job
  let lastCompletionTime = null;
  const cronJob = cron.schedule(
    '*/5 * * * *',
    () => {
      if (
        !lastCompletionTime ||
        Date.now() - lastCompletionTime >= 5 * 60 * 1000
      ) {
        updateParticipantDetails();
        lastCompletionTime = Date.now();
      }
    },
    {
      scheduled: false,
    }
  );
  cronJob.start();

  // Start server
  const port = process.env.PORT || process.env.BACKEND_PORT;
  app.listen(port, () => {
    console.log(
      `Worker ${process.pid} listening on port ${port} in ${process.env.NODE_ENV} mode`
    );
  });
}

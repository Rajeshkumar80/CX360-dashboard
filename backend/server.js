import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';

import config from './config/env.js';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';

import authRoutes from './routes/auth.routes.js';
import complaintRoutes from './routes/complaint.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import webhookRoutes from './routes/webhook.routes.js';
import settingsRoutes from './routes/settings.routes.js';
import { startEmailPoller } from './jobs/emailPoller.js';
import { startSLAChecker } from './jobs/slaChecker.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: config.frontendUrl, methods: ['GET', 'POST'] },
});

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: config.frontendUrl, credentials: true }));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting for auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, error: 'Too many login attempts. Try again in 15 minutes.', code: 'RATE_LIMIT' },
});

// Attach io to requests
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/webhook', webhookRoutes);
app.use('/api/settings', settingsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', portal: 'CX360', version: '1.0.0', time: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

// Socket.io
io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
});

// Start
async function start() {
  const dbConnected = await connectDB();

  // Start background jobs
  startEmailPoller(io);
  startSLAChecker(io);

  httpServer.listen(config.port, () => {
    console.log(`\n🚀 CX360 Backend running on http://localhost:${config.port}`);
    console.log(`   Portal: CX360 — Intelligent Complaint Resolution. Full Circle.`);
    console.log(`   Mode: ${config.nodeEnv}`);
    console.log(`   DB: ${dbConnected ? 'MongoDB Connected' : 'Mock Mode (no DB)'}`);
    console.log(`   AI: ${config.anthropicKey ? 'Claude API Active' : 'Mock AI Fallback'}`);
    console.log(`   Frontend: ${config.frontendUrl}\n`);
  });
}

start();

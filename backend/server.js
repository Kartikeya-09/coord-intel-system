import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import errorHandler from './middleware/errorHandler.js';
import { connectDb } from './utils/connectDb.js';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import stakeholderRoutes from './routes/stakeholders.js';
import projectRoutes from './routes/projects.js';
import activityRoutes from './routes/activities.js';
import dependencyRoutes from './routes/dependencies.js';
import changeEventRoutes from './routes/changeEvents.js';
import impactResultRoutes from './routes/impactResults.js';
import actionRoutes from './routes/actions.js';
import approvalRoutes from './routes/approvals.js';
import alertRoutes from './routes/alerts.js';

const app = express();

const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
app.use(cors({ origin: corsOrigin }));
app.use(express.json());

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Route Mounting
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/stakeholders', stakeholderRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/activities', activityRoutes);
app.use('/api/v1/dependencies', dependencyRoutes);
app.use('/api/v1/change-events', changeEventRoutes);
app.use('/api/v1/impact-results', impactResultRoutes);
app.use('/api/v1/actions', actionRoutes);
app.use('/api/v1/approvals', approvalRoutes);
app.use('/api/v1/alerts', alertRoutes);

// 404 Catch-all
app.use((req, res) => {
  res.status(404).json({ error: { message: 'Route not found' } });
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  connectDb()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`CIS Backend server listening on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error('Failed to start database connection:', err);
    });
}

export default app;

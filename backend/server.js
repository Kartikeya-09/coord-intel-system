require('dotenv').config();
require('express-async-errors');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const errorHandler = require('./middleware/errorHandler');

const app = express();

const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
app.use(cors({ origin: corsOrigin }));
app.use(express.json());

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Route Mounting Stubs (will be replaced as routes are built)
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/stakeholders', require('./routes/stakeholders'));
app.use('/api/v1/projects', require('./routes/projects'));
app.use('/api/v1/activities', require('./routes/activities'));
app.use('/api/v1/dependencies', require('./routes/dependencies'));
app.use('/api/v1/change-events', require('./routes/changeEvents'));
app.use('/api/v1/impact-results', require('./routes/impactResults'));
app.use('/api/v1/actions', require('./routes/actions'));
app.use('/api/v1/approvals', require('./routes/approvals'));
app.use('/api/v1/alerts', require('./routes/alerts'));
// app.use('/api/v1/projects', require('./routes/projectMemory'));

// 404 Catch-all
app.use((req, res) => {
  res.status(404).json({ error: { message: 'Route not found' } });
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const { connectDb } = require('./utils/connectDb');

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

module.exports = app;

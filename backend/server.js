import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import llmRoutes from './routes/llm.js';
import jiraRoutes from './routes/jira.js';
import exportRoutes from './routes/export.js';
import integrationRoutes from './routes/integration.js';
import coverageRoutes from './routes/coverage.js';
import cucumberRoutes from './routes/cucumber.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: '*',
  credentials: false
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/llm', llmRoutes);
app.use('/api/jira', jiraRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/integration', integrationRoutes);
app.use('/api/coverage', coverageRoutes);
app.use('/api/cucumber', cucumberRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'AI Test Case Generator API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      llm: '/api/llm',
      jira: '/api/jira',
      export: '/api/export',
      integration: '/api/integration',
      coverage: '/api/coverage'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});

export default app;

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Server, Database, Globe, Copy, CheckCircle, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function RenderDeploymentGuide() {
  const [copied, setCopied] = useState('');

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(''), 2000);
  };

  const backendPackageJson = `{
  "name": "hqube-backend",
  "version": "1.0.0",
  "description": "hQube Backend API for Render deployment",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "pg": "^8.11.3",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "dotenv": "^16.3.1",
    "multer": "^1.4.5-lts.1",
    "openai": "^4.20.1",
    "@sendgrid/mail": "^7.7.0",
    "stripe": "^14.7.0",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}`;

  const serverJs = `const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const analysisRoutes = require('./routes/analysis');
const ticketRoutes = require('./routes/tickets');
const paymentRoutes = require('./routes/payments');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/payments', paymentRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(\`hQube API server running on port \${PORT}\`);
});`;

  const databaseJs = `const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};`;

  const authRoutes = `const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../utils/database');
const { v4: uuidv4 } = require('uuid');

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, full_name, password } = req.body;
    
    // Check if user exists
    const existingUser = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const result = await db.query(
      \`INSERT INTO users (id, email, full_name, password, role) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id, email, full_name, role\`,
      [uuidv4(), email, full_name, hashedPassword, 'user']
    );
    
    const user = result.rows[0];
    
    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Create session
    await db.query(
      \`INSERT INTO sessions (user_id, token, expires_at) 
       VALUES ($1, $2, NOW() + INTERVAL '7 days')\`,
      [user.id, token]
    );
    
    res.json({ user, token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const result = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Create session
    await db.query(
      \`INSERT INTO sessions (user_id, token, expires_at) 
       VALUES ($1, $2, NOW() + INTERVAL '7 days')\`,
      [user.id, token]
    );
    
    // Remove password from response
    delete user.password;
    
    res.json({ user, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const result = await db.query(
      'SELECT id, email, full_name, role, subscription_plan, subscription_status, plan_type, billing_cycle FROM users WHERE id = $1',
      [decoded.userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Logout
router.post('/logout', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (token) {
      await db.query('DELETE FROM sessions WHERE token = $1', [token]);
    }
    
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

module.exports = router;`;

  const envExample = `# Copy this to .env and fill in your values
# NEVER commit .env to GitHub

DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
OPENAI_API_KEY=sk-your-openai-api-key
SENDGRID_API_KEY=SG.your-sendgrid-api-key
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-public-key
FRONTEND_URL=https://www.hqube.co
PORT=10000`;

  const sqlSchema = `-- Run this SQL in your Render PostgreSQL database

-- Users table with password field
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR NOT NULL UNIQUE,
  full_name VARCHAR,
  password VARCHAR NOT NULL,
  role VARCHAR DEFAULT 'user',
  subscription_plan VARCHAR,
  subscription_status VARCHAR DEFAULT 'inactive',
  plan_type VARCHAR DEFAULT 'none',
  billing_cycle VARCHAR DEFAULT 'none',
  created_date TIMESTAMP DEFAULT now(),
  updated_date TIMESTAMP DEFAULT now()
);

-- Analysis Requests table
CREATE TABLE analysis_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name VARCHAR NOT NULL,
  file_url VARCHAR NOT NULL,
  analysis_summary TEXT,
  status VARCHAR DEFAULT 'pending',
  created_by VARCHAR REFERENCES users(email),
  created_date TIMESTAMP DEFAULT now(),
  updated_date TIMESTAMP DEFAULT now()
);

-- Support Tickets table
CREATE TABLE support_tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email VARCHAR NOT NULL,
  request_type VARCHAR NOT NULL,
  details TEXT NOT NULL,
  status VARCHAR DEFAULT 'new',
  created_date TIMESTAMP DEFAULT now(),
  updated_date TIMESTAMP DEFAULT now()
);

-- Sessions table for authentication
CREATE TABLE sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  token VARCHAR NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_date TIMESTAMP DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_analysis_created_by ON analysis_requests(created_by);
CREATE INDEX idx_tickets_user_email ON support_tickets(user_email);`;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Server className="w-8 h-8 text-purple-600" />
            Deploy hQube on Render - Complete Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Overview */}
            <div className="bg-gradient-to-r from-purple-50 to-teal-50 border border-purple-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Deployment Overview</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <Database className="w-8 h-8 text-blue-600 mb-2" />
                  <h4 className="font-semibold text-slate-900">PostgreSQL</h4>
                  <p className="text-xs text-slate-600 mt-1">Database hosting</p>
                  <p className="text-lg font-bold text-blue-600 mt-2">$7/month</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <Server className="w-8 h-8 text-purple-600 mb-2" />
                  <h4 className="font-semibold text-slate-900">Backend API</h4>
                  <p className="text-xs text-slate-600 mt-1">Node.js/Express</p>
                  <p className="text-lg font-bold text-purple-600 mt-2">$7/month</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <Globe className="w-8 h-8 text-green-600 mb-2" />
                  <h4 className="font-semibold text-slate-900">Frontend</h4>
                  <p className="text-xs text-slate-600 mt-1">Static React site</p>
                  <p className="text-lg font-bold text-green-600 mt-2">FREE</p>
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className="text-2xl font-bold text-slate-900">Total: ~$14/month</p>
              </div>
            </div>

            {/* Step-by-Step Guide */}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">📋 Deployment Steps</h3>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center font-bold text-purple-700">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Create Render Account</h4>
                    <p className="text-sm text-slate-600">Go to render.com and sign up with GitHub</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center font-bold text-purple-700">
                    2
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 mb-2">Create PostgreSQL Database</h4>
                    <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
                      <li>Click "New +" → "PostgreSQL"</li>
                      <li>Name: hqube-database</li>
                      <li>Database: hqube_db</li>
                      <li>Plan: Starter ($7/month)</li>
                      <li>Save the Internal Database URL</li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center font-bold text-purple-700">
                    3
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 mb-2">Run Database Schema</h4>
                    <p className="text-sm text-slate-600 mb-2">Connect to your database and run the SQL below</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center font-bold text-purple-700">
                    4
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 mb-2">Create Backend Repository</h4>
                    <p className="text-sm text-slate-600">Create a new GitHub repository with the backend code below</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center font-bold text-purple-700">
                    5
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 mb-2">Deploy Backend on Render</h4>
                    <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
                      <li>Click "New +" → "Web Service"</li>
                      <li>Connect your GitHub repo</li>
                      <li>Build Command: npm install</li>
                      <li>Start Command: node server.js</li>
                      <li>Add all environment variables</li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center font-bold text-purple-700">
                    6
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 mb-2">Deploy Frontend</h4>
                    <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
                      <li>Update frontend to use your backend URL</li>
                      <li>Deploy on Render as Static Site (FREE)</li>
                      <li>Configure custom domain (www.hqube.co)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Code Tabs */}
            <Tabs defaultValue="sql" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="sql">SQL Schema</TabsTrigger>
                <TabsTrigger value="package">package.json</TabsTrigger>
                <TabsTrigger value="server">server.js</TabsTrigger>
                <TabsTrigger value="auth">auth.js</TabsTrigger>
                <TabsTrigger value="env">.env</TabsTrigger>
              </TabsList>

              <TabsContent value="sql">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Database Schema (SQL)</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(sqlSchema, 'sql')}
                    >
                      {copied === 'sql' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-xs">
                      {sqlSchema}
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="package">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">package.json</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(backendPackageJson, 'package')}
                    >
                      {copied === 'package' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-xs">
                      {backendPackageJson}
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="server">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">server.js</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(serverJs, 'server')}
                    >
                      {copied === 'server' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-xs">
                      {serverJs}
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="auth">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">routes/auth.js</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(authRoutes, 'auth')}
                    >
                      {copied === 'auth' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-xs">
                      {authRoutes}
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="env">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">.env.example</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(envExample, 'env')}
                    >
                      {copied === 'env' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                      <p className="text-sm text-red-800">
                        <AlertCircle className="w-4 h-4 inline mr-2" />
                        <strong>Security:</strong> Never commit .env to GitHub. Add it to .gitignore
                      </p>
                    </div>
                    <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-xs">
                      {envExample}
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Important Notes */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Important Notes
              </h3>
              <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
                <li>You'll need additional route files (users.js, analysis.js, tickets.js, payments.js)</li>
                <li>Store all sensitive keys in Render environment variables, not in code</li>
                <li>Enable CORS only for your frontend domain</li>
                <li>Render provides automatic SSL certificates</li>
                <li>Backend will auto-deploy when you push to GitHub</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
/*
=================================================================
HQUBE DEPLOYMENT GUIDE - RENDER PLATFORM
=================================================================

OVERVIEW:
Render will host:
- Backend API (Node.js/Express)
- PostgreSQL Database
- Frontend (Static Site)
- File Storage

COST ESTIMATE:
- Backend Web Service: $7/month (Starter)
- PostgreSQL Database: $7/month (Starter) 
- Frontend Static Site: FREE
- Total: ~$14/month

=================================================================
STEP 1: CREATE RENDER ACCOUNT
=================================================================
1. Go to render.com
2. Sign up with GitHub (recommended for easy deployment)
3. Verify your email

=================================================================
STEP 2: SET UP POSTGRESQL DATABASE
=================================================================
1. In Render Dashboard, click "New +"
2. Select "PostgreSQL"
3. Configure:
   - Name: hqube-database
   - Database: hqube_db
   - User: hqube_user
   - Region: Choose closest to your users
   - Plan: Starter ($7/month)
4. Click "Create Database"
5. **SAVE THESE** (found in database details):
   - Internal Database URL
   - External Database URL
   - PSQL Command

6. Connect using PSQL and run this SQL:

-- Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR NOT NULL UNIQUE,
  full_name VARCHAR,
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

-- Sessions table (for authentication)
CREATE TABLE sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  token VARCHAR NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_date TIMESTAMP DEFAULT now()
);

=================================================================
STEP 3: DEPLOY BACKEND API
=================================================================
1. Create a GitHub repository for your backend code
   (I'll provide the backend code below)

2. In Render Dashboard, click "New +"
3. Select "Web Service"
4. Connect your GitHub repository
5. Configure:
   - Name: hqube-api
   - Environment: Node
   - Build Command: npm install
   - Start Command: node server.js
   - Plan: Starter ($7/month)

6. Add Environment Variables (in Render dashboard):
   DATABASE_URL=<your-internal-database-url>
   JWT_SECRET=<generate-random-string>
   OPENAI_API_KEY=<your-openai-key>
   SENDGRID_API_KEY=<your-sendgrid-key>
   STRIPE_SECRET_KEY=<your-stripe-secret>
   FRONTEND_URL=https://hqube.co
   PORT=10000

7. Click "Create Web Service"
8. Render will automatically deploy
9. **SAVE** your backend URL (e.g., https://hqube-api.onrender.com)

=================================================================
STEP 4: DEPLOY FRONTEND
=================================================================
1. Update your frontend code with backend URL
2. Create GitHub repository for frontend
3. In Render Dashboard, click "New +"
4. Select "Static Site"
5. Connect your GitHub repository
6. Configure:
   - Name: hqube-frontend
   - Build Command: npm run build
   - Publish Directory: dist
7. Add Environment Variables:
   VITE_API_URL=<your-backend-url>
   VITE_STRIPE_PUBLISHABLE_KEY=<your-stripe-public-key>

8. Click "Create Static Site"
9. Render will build and deploy

=================================================================
STEP 5: CONFIGURE CUSTOM DOMAIN
=================================================================
1. In Static Site settings, go to "Custom Domains"
2. Add: www.hqube.co
3. Render will provide DNS settings
4. Update your domain registrar (Hostinger) DNS:
   - Add CNAME record: www → <render-provided-url>
   - Or use A record if needed

=================================================================
STEP 6: SET UP SSL/HTTPS
=================================================================
Render automatically provides free SSL certificates
- Your site will be https://www.hqube.co
- SSL renews automatically

=================================================================
BACKEND CODE STRUCTURE (for GitHub repo)
=================================================================

Create these files in your backend repository:

1. package.json
2. server.js (main server file)
3. routes/
   - auth.js (authentication routes)
   - users.js (user management)
   - analysis.js (document analysis)
   - tickets.js (support tickets)
   - payments.js (Stripe integration)
4. middleware/
   - auth.js (JWT verification)
5. utils/
   - database.js (PostgreSQL connection)
   - email.js (SendGrid integration)
   - openai.js (AI integration)

=================================================================
IMPORTANT SECURITY NOTES
=================================================================
✅ Never commit API keys to GitHub
✅ Use environment variables for all secrets
✅ Enable CORS only for your frontend domain
✅ Use HTTPS for all API calls
✅ Implement rate limiting
✅ Validate all user inputs
✅ Use parameterized SQL queries (prevent SQL injection)
✅ Hash passwords with bcrypt
✅ Use JWT tokens with expiration

=================================================================
MONITORING & MAINTENANCE
=================================================================
- Render provides automatic deployments on git push
- View logs in Render dashboard
- Set up health check endpoints
- Monitor database usage
- Set up backup schedule for database
- Use Render metrics for performance monitoring

*/

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Server, Database, Globe, Shield, CheckCircle, AlertCircle } from 'lucide-react';

export default function RenderDeploymentGuide() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="w-6 h-6 text-purple-600" />
            Deploy hQube on Render
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-green-900 mb-1">
                    Why Render?
                  </p>
                  <ul className="text-xs text-green-800 space-y-1">
                    <li>• Easy deployment from GitHub</li>
                    <li>• Automatic SSL certificates</li>
                    <li>• Built-in database hosting</li>
                    <li>• Free static site hosting</li>
                    <li>• Auto-deploys on code push</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <Database className="w-8 h-8 text-blue-600 mb-2" />
                <h3 className="font-semibold text-slate-900 mb-1">Database</h3>
                <p className="text-xs text-slate-600">PostgreSQL hosted on Render</p>
                <p className="text-sm font-bold text-slate-900 mt-2">$7/month</p>
              </div>

              <div className="border rounded-lg p-4">
                <Server className="w-8 h-8 text-purple-600 mb-2" />
                <h3 className="font-semibold text-slate-900 mb-1">Backend API</h3>
                <p className="text-xs text-slate-600">Node.js/Express server</p>
                <p className="text-sm font-bold text-slate-900 mt-2">$7/month</p>
              </div>

              <div className="border rounded-lg p-4">
                <Globe className="w-8 h-8 text-green-600 mb-2" />
                <h3 className="font-semibold text-slate-900 mb-1">Frontend</h3>
                <p className="text-xs text-slate-600">React static site</p>
                <p className="text-sm font-bold text-green-600 mt-2">FREE</p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-900 mb-1">
                    Before You Start
                  </p>
                  <ul className="text-xs text-amber-800 space-y-1">
                    <li>• Create GitHub account</li>
                    <li>• Get OpenAI API key (for AI features)</li>
                    <li>• Get SendGrid API key (for emails)</li>
                    <li>• Get Stripe keys (for payments)</li>
                    <li>• Have domain ready (www.hqube.co)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
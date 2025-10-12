import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ArrowRight, Database, Github, AlertCircle, Copy, Eye, EyeOff } from 'lucide-react';

export default function RenderWalkthrough() {
  const [currentStep, setCurrentStep] = useState(1);
  const [completed, setCompleted] = useState([]);

  const markComplete = (step) => {
    if (!completed.includes(step)) {
      setCompleted([...completed, step]);
    }
    if (step < 6) {
      setCurrentStep(step + 1);
    }
  };

  const Step = ({ number, title, children, isActive }) => (
    <Card className={`mb-6 ${isActive ? 'border-2 border-teal-500 shadow-lg' : completed.includes(number) ? 'border-green-500 bg-green-50' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
              completed.includes(number) ? 'bg-green-500 text-white' : 
              isActive ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}>
              {completed.includes(number) ? <CheckCircle className="w-6 h-6" /> : number}
            </div>
            <CardTitle className="text-xl">{title}</CardTitle>
          </div>
          {completed.includes(number) && (
            <Badge className="bg-green-500 text-white">Completed</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {children}
        {isActive && !completed.includes(number) && (
          <Button 
            onClick={() => markComplete(number)} 
            className="mt-4 bg-teal-600 hover:bg-teal-700"
          >
            Mark as Complete <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-3">🚀 Deploy hQube on Render</h1>
        <p className="text-xl text-slate-600">Follow these steps in order - I'll guide you through each one!</p>
        <div className="mt-4">
          <Badge className="bg-teal-100 text-teal-800 text-base px-4 py-2">
            Step {currentStep} of 6
          </Badge>
        </div>
      </div>

      {/* Step 1: Create Render Account */}
      <Step number={1} title="Create Your Render Account" isActive={currentStep === 1}>
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-900 font-semibold mb-2">🎯 What you'll do:</p>
            <p className="text-blue-800">Sign up for Render and connect it to your GitHub account</p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-slate-900 flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-teal-600" />
              Action Steps:
            </h4>
            <ol className="space-y-3 ml-6">
              <li className="flex gap-3">
                <span className="font-bold text-teal-600">1.</span>
                <div>
                  <p className="font-medium">Go to Render.com</p>
                  <a href="https://render.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                    https://render.com
                  </a>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-teal-600">2.</span>
                <div>
                  <p className="font-medium">Click "Get Started" in the top right</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-teal-600">3.</span>
                <div>
                  <p className="font-medium">Sign up with GitHub</p>
                  <p className="text-sm text-slate-600">This makes deployment easier - Render can access your code repositories</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-teal-600">4.</span>
                <div>
                  <p className="font-medium">Verify your email</p>
                  <p className="text-sm text-slate-600">Check your inbox and click the verification link</p>
                </div>
              </li>
            </ol>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
            <p className="text-sm text-amber-800">
              <AlertCircle className="w-4 h-4 inline mr-2" />
              <strong>Note:</strong> Render will ask for credit card info, but you won't be charged until you deploy paid services
            </p>
          </div>
        </div>
      </Step>

      {/* Step 2: Create PostgreSQL Database */}
      <Step number={2} title="Create PostgreSQL Database" isActive={currentStep === 2}>
        <div className="space-y-4">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-purple-900 font-semibold mb-2">🎯 What you'll do:</p>
            <p className="text-purple-800">Set up a database to store users, subscriptions, and analysis data</p>
            <p className="text-purple-800 text-sm mt-1">💰 Cost: $7/month (Starter plan)</p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-slate-900 flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-teal-600" />
              Action Steps:
            </h4>
            <ol className="space-y-3 ml-6">
              <li className="flex gap-3">
                <span className="font-bold text-teal-600">1.</span>
                <div>
                  <p className="font-medium">In Render Dashboard, click the blue "New +" button</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-teal-600">2.</span>
                <div>
                  <p className="font-medium">Select "PostgreSQL"</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-teal-600">3.</span>
                <div>
                  <p className="font-medium">Fill in these fields:</p>
                  <div className="mt-2 bg-slate-900 text-slate-100 p-3 rounded text-sm font-mono">
                    <div>Name: hqube-database</div>
                    <div>Database: hqube_db</div>
                    <div>User: hqube_user</div>
                    <div>Region: Oregon (US West) - or closest to you</div>
                  </div>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-teal-600">4.</span>
                <div>
                  <p className="font-medium">Select Plan: <strong>Starter ($7/month)</strong></p>
                  <p className="text-sm text-slate-600">This gives you 1GB storage - perfect for starting</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-teal-600">5.</span>
                <div>
                  <p className="font-medium">Click "Create Database"</p>
                  <p className="text-sm text-slate-600">⏱️ Wait 2-3 minutes for it to provision</p>
                </div>
              </li>
            </ol>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
            <p className="text-sm text-green-800 font-semibold mb-2">
              <CheckCircle className="w-4 h-4 inline mr-2" />
              What to do when database is ready:
            </p>
            <ul className="text-sm text-green-800 space-y-1 list-disc list-inside">
              <li>You'll see a green "Available" status</li>
              <li>Don't close this tab - you'll need the connection info in the next step</li>
            </ul>
          </div>
        </div>
      </Step>

      {/* Step 3: Save Database Connection Info */}
      <Step number={3} title="Save Your Database Connection Info" isActive={currentStep === 3}>
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-900 font-semibold mb-2">
              <AlertCircle className="w-4 h-4 inline mr-2" />
              CRITICAL - Don't Skip This!
            </p>
            <p className="text-red-800">You need to save these connection details securely</p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-slate-900 flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-teal-600" />
              Action Steps:
            </h4>
            <ol className="space-y-4 ml-6">
              <li className="flex gap-3">
                <span className="font-bold text-teal-600">1.</span>
                <div className="flex-1">
                  <p className="font-medium mb-2">Click on your new "hqube-database"</p>
                  <p className="text-sm text-slate-600">You should see connection details at the top</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-teal-600">2.</span>
                <div className="flex-1">
                  <p className="font-medium mb-2">Find and copy the <strong>Internal Database URL</strong></p>
                  <div className="mt-2 bg-slate-900 text-slate-100 p-3 rounded text-xs font-mono break-all">
                    postgres://hqube_user:xxxxx@dpg-xxxxx-a/hqube_db
                  </div>
                  <p className="text-sm text-slate-600 mt-2">
                    <Database className="w-3 h-3 inline mr-1" />
                    Look for "Internal Database URL" - click the copy icon
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-teal-600">3.</span>
                <div className="flex-1">
                  <p className="font-medium mb-2">Save it somewhere safe (Notepad, password manager)</p>
                  <p className="text-sm text-slate-600">You'll need this in Step 5 when deploying the backend</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-teal-600">4.</span>
                <div className="flex-1">
                  <p className="font-medium mb-2">Also copy the <strong>PSQL Command</strong></p>
                  <p className="text-sm text-slate-600">You'll use this to set up your database tables</p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </Step>

      {/* Step 4: Set Up Database Tables */}
      <Step number={4} title="Create Database Tables" isActive={currentStep === 4}>
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-900 font-semibold mb-2">🎯 What you'll do:</p>
            <p className="text-blue-800">Run SQL commands to create tables for users, subscriptions, analysis requests, and support tickets</p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-slate-900 flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-teal-600" />
              Action Steps:
            </h4>
            <ol className="space-y-4 ml-6">
              <li className="flex gap-3">
                <span className="font-bold text-teal-600">1.</span>
                <div className="flex-1">
                  <p className="font-medium mb-2">Scroll down on your database page</p>
                  <p className="text-sm text-slate-600">Find the "Connect" section</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-teal-600">2.</span>
                <div className="flex-1">
                  <p className="font-medium mb-2">Click the "PSQL Command" tab</p>
                  <p className="text-sm text-slate-600">Copy the command that looks like:</p>
                  <div className="mt-2 bg-slate-900 text-slate-100 p-3 rounded text-xs font-mono">
                    PGPASSWORD=xxxxx psql -h dpg-xxxxx postgres://hqube_user...
                  </div>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-teal-600">3.</span>
                <div className="flex-1">
                  <p className="font-medium mb-2">Open your computer's Terminal (Mac/Linux) or Command Prompt (Windows)</p>
                  <p className="text-sm text-slate-600">
                    Mac: Applications → Utilities → Terminal<br/>
                    Windows: Search for "cmd" or "Command Prompt"
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-teal-600">4.</span>
                <div className="flex-1">
                  <p className="font-medium mb-2">Paste and run the PSQL command</p>
                  <p className="text-sm text-slate-600">Press Enter - you should see: <code className="bg-slate-100 px-1 rounded">hqube_db=&gt;</code></p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-teal-600">5.</span>
                <div className="flex-1">
                  <p className="font-medium mb-2">Copy and paste this SQL (all at once):</p>
                  <div className="mt-2 bg-slate-900 text-slate-100 p-4 rounded text-xs font-mono max-h-64 overflow-y-auto">
{`-- Users table
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

-- Analysis Requests
CREATE TABLE analysis_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name VARCHAR NOT NULL,
  file_url VARCHAR NOT NULL,
  analysis_summary TEXT,
  status VARCHAR DEFAULT 'pending',
  created_by VARCHAR,
  created_date TIMESTAMP DEFAULT now(),
  updated_date TIMESTAMP DEFAULT now()
);

-- Support Tickets
CREATE TABLE support_tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email VARCHAR NOT NULL,
  request_type VARCHAR NOT NULL,
  details TEXT NOT NULL,
  status VARCHAR DEFAULT 'new',
  created_date TIMESTAMP DEFAULT now(),
  updated_date TIMESTAMP DEFAULT now()
);

-- Sessions
CREATE TABLE sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  token VARCHAR NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_date TIMESTAMP DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_analysis_created_by ON analysis_requests(created_by);`}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => navigator.clipboard.writeText(`CREATE TABLE users (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, email VARCHAR NOT NULL UNIQUE, full_name VARCHAR, password VARCHAR NOT NULL, role VARCHAR DEFAULT 'user', subscription_plan VARCHAR, subscription_status VARCHAR DEFAULT 'inactive', plan_type VARCHAR DEFAULT 'none', billing_cycle VARCHAR DEFAULT 'none', created_date TIMESTAMP DEFAULT now(), updated_date TIMESTAMP DEFAULT now()); CREATE TABLE analysis_requests (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, file_name VARCHAR NOT NULL, file_url VARCHAR NOT NULL, analysis_summary TEXT, status VARCHAR DEFAULT 'pending', created_by VARCHAR, created_date TIMESTAMP DEFAULT now(), updated_date TIMESTAMP DEFAULT now()); CREATE TABLE support_tickets (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, user_email VARCHAR NOT NULL, request_type VARCHAR NOT NULL, details TEXT NOT NULL, status VARCHAR DEFAULT 'new', created_date TIMESTAMP DEFAULT now(), updated_date TIMESTAMP DEFAULT now()); CREATE TABLE sessions (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, user_id UUID REFERENCES users(id), token VARCHAR NOT NULL UNIQUE, expires_at TIMESTAMP NOT NULL, created_date TIMESTAMP DEFAULT now()); CREATE INDEX idx_users_email ON users(email); CREATE INDEX idx_sessions_token ON sessions(token); CREATE INDEX idx_analysis_created_by ON analysis_requests(created_by);`)}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy SQL
                  </Button>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-teal-600">6.</span>
                <div className="flex-1">
                  <p className="font-medium mb-2">Press Enter and verify</p>
                  <p className="text-sm text-slate-600">You should see "CREATE TABLE" messages for each table</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-teal-600">7.</span>
                <div className="flex-1">
                  <p className="font-medium mb-2">Type <code className="bg-slate-100 px-2 py-1 rounded">\dt</code> and press Enter</p>
                  <p className="text-sm text-slate-600">This lists your tables - you should see: users, analysis_requests, support_tickets, sessions</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-teal-600">8.</span>
                <div className="flex-1">
                  <p className="font-medium">Type <code className="bg-slate-100 px-2 py-1 rounded">\q</code> to exit</p>
                </div>
              </li>
            </ol>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800 font-semibold">
              <CheckCircle className="w-4 h-4 inline mr-2" />
              Success! Your database is now ready to store data
            </p>
          </div>
        </div>
      </Step>

      {/* Step 5: Prepare Backend Code */}
      <Step number={5} title="Create GitHub Repository for Backend" isActive={currentStep === 5}>
        <div className="space-y-4">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-purple-900 font-semibold mb-2">🎯 What you'll do:</p>
            <p className="text-purple-800">Create a GitHub repository with your backend API code</p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-slate-900 flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-teal-600" />
              Action Steps:
            </h4>
            <ol className="space-y-3 ml-6">
              <li className="flex gap-3">
                <span className="font-bold text-teal-600">1.</span>
                <div>
                  <p className="font-medium">Go to GitHub.com and log in</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-teal-600">2.</span>
                <div>
                  <p className="font-medium">Click the "+" icon → "New repository"</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-teal-600">3.</span>
                <div>
                  <p className="font-medium">Repository name: <strong>hqube-backend</strong></p>
                  <p className="text-sm text-slate-600">Make it Public (easier for first deployment)</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-teal-600">4.</span>
                <div>
                  <p className="font-medium">Check "Add a README file"</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-teal-600">5.</span>
                <div>
                  <p className="font-medium">Click "Create repository"</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-teal-600">6.</span>
                <div>
                  <p className="font-medium mb-2">Add backend files - go to <strong>components/BackendRoutesCode.jsx</strong></p>
                  <p className="text-sm text-slate-600">Copy each file's code and create it in your GitHub repo</p>
                </div>
              </li>
            </ol>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-800">
              <AlertCircle className="w-4 h-4 inline mr-2" />
              <strong>Next:</strong> Once your repo is ready, you'll deploy it on Render (Step 6)
            </p>
          </div>
        </div>
      </Step>

      {/* Step 6: Deploy Backend to Render */}
      <Step number={6} title="Deploy Backend API to Render" isActive={currentStep === 6}>
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-900 font-semibold mb-2">🎯 Final Step!</p>
            <p className="text-green-800">Deploy your backend so it can process payments and handle requests</p>
            <p className="text-green-800 text-sm mt-1">💰 Cost: $7/month (Starter plan)</p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-slate-900 flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-teal-600" />
              Action Steps:
            </h4>
            <ol className="space-y-4 ml-6">
              <li className="flex gap-3">
                <span className="font-bold text-teal-600">1.</span>
                <div>
                  <p className="font-medium">In Render Dashboard, click "New +" → "Web Service"</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-teal-600">2.</span>
                <div>
                  <p className="font-medium">Connect to your <strong>hqube-backend</strong> repository</p>
                  <p className="text-sm text-slate-600">Click "Connect" next to your repo name</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-teal-600">3.</span>
                <div>
                  <p className="font-medium mb-2">Fill in these settings:</p>
                  <div className="bg-slate-900 text-slate-100 p-3 rounded text-sm font-mono space-y-1">
                    <div>Name: hqube-api</div>
                    <div>Environment: Node</div>
                    <div>Build Command: npm install</div>
                    <div>Start Command: node server.js</div>
                    <div>Plan: Starter ($7/month)</div>
                  </div>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-teal-600">4.</span>
                <div className="flex-1">
                  <p className="font-medium mb-2">Scroll down to "Environment Variables"</p>
                  <p className="text-sm text-slate-600 mb-2">Click "Add Environment Variable" and add these:</p>
                  <div className="bg-slate-900 text-slate-100 p-3 rounded text-xs font-mono space-y-1 max-h-48 overflow-y-auto">
                    <div><span className="text-green-400">DATABASE_URL</span> = [Your Internal Database URL from Step 3]</div>
                    <div><span className="text-green-400">JWT_SECRET</span> = [Any random string, like: hqube_secret_2024_xyz123]</div>
                    <div><span className="text-green-400">FRONTEND_URL</span> = https://hqube.co</div>
                    <div><span className="text-green-400">PORT</span> = 10000</div>
                    <div className="text-slate-400">// Add these when ready:</div>
                    <div><span className="text-yellow-400">STRIPE_SECRET_KEY</span> = [From Stripe Dashboard]</div>
                    <div><span className="text-yellow-400">OPENAI_API_KEY</span> = [From OpenAI Dashboard]</div>
                    <div><span className="text-yellow-400">SENDGRID_API_KEY</span> = [From SendGrid Dashboard]</div>
                  </div>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-teal-600">5.</span>
                <div>
                  <p className="font-medium">Click "Create Web Service"</p>
                  <p className="text-sm text-slate-600">⏱️ Wait 5-10 minutes for deployment</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-teal-600">6.</span>
                <div>
                  <p className="font-medium mb-2">Copy your backend URL</p>
                  <p className="text-sm text-slate-600">It will look like: <code className="bg-slate-100 px-2 py-1 rounded">https://hqube-api.onrender.com</code></p>
                  <p className="text-sm text-green-600 mt-1">Save this - you'll need it for your frontend!</p>
                </div>
              </li>
            </ol>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-semibold mb-2">
              <CheckCircle className="w-4 h-4 inline mr-2" />
              Congratulations! Your backend is live! 🎉
            </p>
            <p className="text-sm text-green-800">
              Next, you'll deploy your frontend and connect it to this backend URL.
            </p>
          </div>
        </div>
      </Step>

      {/* Progress Summary */}
      <Card className="mt-8 bg-gradient-to-r from-teal-50 to-blue-50 border-teal-200">
        <CardHeader>
          <CardTitle>📊 Your Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5, 6].map(step => (
              <div key={step} className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                  completed.includes(step) ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {completed.includes(step) ? <CheckCircle className="w-4 h-4" /> : step}
                </div>
                <span className={completed.includes(step) ? 'text-green-700 font-medium' : 'text-slate-600'}>
                  Step {step} {completed.includes(step) && '✓'}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-slate-600">
              <strong>Estimated Monthly Cost:</strong> $14/month ($7 database + $7 backend)
            </p>
            <p className="text-sm text-slate-600 mt-1">
              <strong>Frontend:</strong> FREE (deployed as static site)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
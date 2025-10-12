/*
=================================================================
SUPABASE SETUP GUIDE FOR HQUBE
=================================================================

STEP 1: GET YOUR SUPABASE CREDENTIALS
--------------------------------------
1. Go to your Supabase dashboard (supabase.com)
2. Select your hQube project (or create new one)
3. Go to Settings → API
4. Copy these values (keep them SECRET):
   - Project URL
   - anon/public key
   - service_role key (backend only)

STEP 2: CREATE ENVIRONMENT FILES
----------------------------------
Create a .env.local file in your project root:

VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here

For backend (Railway), add:
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

STEP 3: INSTALL SUPABASE CLIENT
--------------------------------
Run in your terminal:
npm install @supabase/supabase-js

STEP 4: CREATE DATABASE TABLES
-------------------------------
In Supabase SQL Editor, run:

-- Users table (extends built-in auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email VARCHAR NOT NULL,
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
CREATE TABLE public.analysis_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name VARCHAR NOT NULL,
  file_url VARCHAR NOT NULL,
  analysis_summary TEXT,
  status VARCHAR DEFAULT 'pending',
  created_by UUID REFERENCES auth.users(id),
  created_date TIMESTAMP DEFAULT now(),
  updated_date TIMESTAMP DEFAULT now()
);

-- Support Tickets table
CREATE TABLE public.support_tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email VARCHAR NOT NULL,
  request_type VARCHAR NOT NULL,
  details TEXT NOT NULL,
  status VARCHAR DEFAULT 'new',
  created_date TIMESTAMP DEFAULT now(),
  updated_date TIMESTAMP DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (auth.uid() = id OR role = 'admin');

CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for analysis_requests
CREATE POLICY "Users can view own requests" ON public.analysis_requests
  FOR SELECT USING (auth.uid() = created_by OR 
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Users can create own requests" ON public.analysis_requests
  FOR INSERT WITH CHECK (auth.uid() = created_by);

-- RLS Policies for support_tickets
CREATE POLICY "Users can view own tickets" ON public.support_tickets
  FOR SELECT USING (user_email = auth.email() OR 
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Anyone can create tickets" ON public.support_tickets
  FOR INSERT WITH CHECK (true);

STEP 5: ENABLE AUTHENTICATION
------------------------------
In Supabase Dashboard:
1. Go to Authentication → Providers
2. Enable Email authentication
3. Enable Google OAuth (optional)
4. Configure redirect URLs:
   - http://localhost:3000/** (for development)
   - https://www.hqube.co/** (for production)

STEP 6: ENABLE STORAGE
-----------------------
1. Go to Storage
2. Create bucket: "documents"
3. Set policies:
   - Allow authenticated users to upload
   - Allow users to read own files

CREATE POLICY "Users can upload documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'documents' AND 
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can read own documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'documents' AND 
    auth.uid() = owner
  );
*/

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertCircle, Database, Shield, Upload, Key } from 'lucide-react';

export default function SupabaseSetupGuide() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-6 h-6 text-blue-600" />
            Supabase Setup Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-900 mb-1">
                  NEVER Share Your Supabase Credentials
                </p>
                <p className="text-xs text-red-800">
                  Keep your API keys, database URLs, and service role keys private. 
                  Store them only in environment variables on your server.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Key className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Step 1: Get Credentials</h3>
                <p className="text-sm text-slate-600">
                  From Supabase Dashboard → Settings → API, copy your Project URL and anon key
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Step 2: Configure Environment</h3>
                <p className="text-sm text-slate-600">
                  Create .env.local file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Database className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Step 3: Create Tables</h3>
                <p className="text-sm text-slate-600">
                  Run the SQL commands above in Supabase SQL Editor
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Upload className="w-5 h-5 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Step 4: Enable Services</h3>
                <p className="text-sm text-slate-600">
                  Set up Authentication providers and Storage buckets
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
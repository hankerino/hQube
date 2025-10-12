import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Server, Key, Webhook, Shield, CheckCircle, AlertTriangle, Code, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function StripeSetupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-blue-100 text-blue-800">Payment Integration</Badge>
          <h1 className="text-5xl font-bold text-slate-900 mb-4">Stripe Payment Integration</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Complete guide to integrate Stripe payments into your hQube application
          </p>
        </div>

        {/* Current Status Warning */}
        <Card className="mb-8 border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-amber-900">
              <AlertTriangle className="w-6 h-6" />
              Current Payment Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-amber-800 mb-4">
              Your checkout page is currently in <strong>simulation mode</strong>. It updates subscription status without charging real money.
            </p>
            <p className="text-amber-800">
              To process real payments, follow the integration steps below.
            </p>
          </CardContent>
        </Card>

        {/* Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Key className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg">1. Get API Keys</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 text-sm">
                Sign up for Stripe and get your Publishable Key and Secret Key from the dashboard.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Server className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle className="text-lg">2. Deploy Backend</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 text-sm">
                Deploy the payment processing backend on Render with your Stripe keys.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <CreditCard className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-lg">3. Update Frontend</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 text-sm">
                Install Stripe Elements and connect your frontend to the backend API.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Steps */}
        <div className="space-y-6">
          {/* Step 1 */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
              <CardTitle className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                Create Stripe Account & Get API Keys
              </CardTitle>
            </CardHeader>
            <CardContent className="mt-6">
              <ol className="space-y-4 text-slate-700">
                <li className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Sign up:</strong> Go to <a href="https://stripe.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">stripe.com</a> and create an account
                  </div>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Complete verification:</strong> Add your business details and banking information
                  </div>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Get API keys:</strong> Navigate to Developers → API keys
                    <ul className="mt-2 ml-4 space-y-1 text-sm">
                      <li>📋 Copy <strong>Publishable key</strong> (pk_test_...)</li>
                      <li>🔐 Copy <strong>Secret key</strong> (sk_test_...)</li>
                    </ul>
                  </div>
                </li>
              </ol>

              <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800 font-semibold mb-2">
                  <Shield className="w-4 h-4 inline mr-2" />
                  Security Warning:
                </p>
                <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
                  <li>Never share your Secret Key publicly</li>
                  <li>Never commit API keys to GitHub</li>
                  <li>Store keys in environment variables only</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100">
              <CardTitle className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                Backend Setup on Render
              </CardTitle>
            </CardHeader>
            <CardContent className="mt-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Required Environment Variables:</h4>
                  <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-sm">
                    <div>DATABASE_URL=your_postgres_url</div>
                    <div>JWT_SECRET=your_random_secret</div>
                    <div className="text-green-400">STRIPE_SECRET_KEY=sk_test_...</div>
                    <div className="text-green-400">STRIPE_WEBHOOK_SECRET=whsec_...</div>
                    <div>OPENAI_API_KEY=sk-...</div>
                    <div>SENDGRID_API_KEY=SG....</div>
                    <div>FRONTEND_URL=https://hqube.co</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Backend Code Location:</h4>
                  <p className="text-slate-600 mb-3">
                    Find the complete backend code in the components:
                  </p>
                  <div className="flex gap-3">
                    <Button asChild variant="outline" size="sm">
                      <a href="#backend-routes">
                        <Code className="w-4 h-4 mr-2" />
                        View Backend Routes
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
              <CardTitle className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                Frontend Integration
              </CardTitle>
            </CardHeader>
            <CardContent className="mt-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Install Stripe Libraries:</h4>
                  <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-sm">
                    npm install @stripe/stripe-js @stripe/react-stripe-js
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Environment Variables (.env.local):</h4>
                  <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-sm">
                    <div className="text-green-400">VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...</div>
                    <div>VITE_API_URL=https://your-backend.onrender.com</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Components to Create:</h4>
                  <ul className="space-y-2 text-slate-600">
                    <li className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-green-600" />
                      <code className="bg-slate-100 px-2 py-1 rounded text-sm">components/StripePaymentForm.jsx</code>
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-green-600" />
                      Update <code className="bg-slate-100 px-2 py-1 rounded text-sm">pages/Checkout.js</code>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 4 */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100">
              <CardTitle className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">4</div>
                Configure Webhooks
              </CardTitle>
            </CardHeader>
            <CardContent className="mt-6">
              <ol className="space-y-3 text-slate-700">
                <li className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>In Stripe Dashboard, go to <strong>Developers → Webhooks</strong></div>
                </li>
                <li className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>Click <strong>Add endpoint</strong></div>
                </li>
                <li className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    Endpoint URL: <code className="bg-slate-100 px-2 py-1 rounded text-sm">https://your-backend.onrender.com/api/payments/webhook</code>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  <div>
                    Select events:
                    <ul className="mt-2 ml-4 space-y-1 text-sm">
                      <li>✓ payment_intent.succeeded</li>
                      <li>✓ payment_intent.payment_failed</li>
                      <li>✓ customer.subscription.deleted</li>
                    </ul>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold">5</div>
                  <div>Copy the <strong>Signing secret</strong> and add to Render environment variables</div>
                </li>
              </ol>
            </CardContent>
          </Card>

          {/* Testing */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-teal-50 to-teal-100">
              <CardTitle className="flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-teal-600" />
                Testing Your Integration
              </CardTitle>
            </CardHeader>
            <CardContent className="mt-6">
              <h4 className="font-semibold text-slate-900 mb-3">Stripe Test Card Numbers:</h4>
              <div className="space-y-3">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <code className="font-mono text-green-900">4242 4242 4242 4242</code>
                  <span className="ml-3 text-sm text-green-700">✓ Successful payment</span>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <code className="font-mono text-red-900">4000 0000 0000 9995</code>
                  <span className="ml-3 text-sm text-red-700">✗ Declined payment</span>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <code className="font-mono text-blue-900">4000 0025 0000 3155</code>
                  <span className="ml-3 text-sm text-blue-700">⚠ Requires authentication (3D Secure)</span>
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-600">
                Use any future expiration date and any 3-digit CVC
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Resources Section */}
        <Card className="mt-12 shadow-lg border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900">📚 Complete Code & Guides</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-800 mb-6">
              Access all the code you need in these components (scroll down to view):
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 shadow">
                <h4 className="font-semibold text-slate-900 mb-2">Backend Code</h4>
                <p className="text-sm text-slate-600 mb-3">Complete API routes with Stripe payment processing</p>
                <Badge className="bg-purple-100 text-purple-800">components/BackendRoutesCode.jsx</Badge>
              </div>
              <div className="bg-white rounded-lg p-4 shadow">
                <h4 className="font-semibold text-slate-900 mb-2">Stripe Integration</h4>
                <p className="text-sm text-slate-600 mb-3">Frontend payment forms and setup guide</p>
                <Badge className="bg-blue-100 text-blue-800">components/StripeIntegrationGuide.jsx</Badge>
              </div>
              <div className="bg-white rounded-lg p-4 shadow">
                <h4 className="font-semibold text-slate-900 mb-2">Render Deployment</h4>
                <p className="text-sm text-slate-600 mb-3">Full backend deployment instructions</p>
                <Badge className="bg-green-100 text-green-800">components/RenderDeploymentGuide.jsx</Badge>
              </div>
              <div className="bg-white rounded-lg p-4 shadow">
                <h4 className="font-semibold text-slate-900 mb-2">Database Schema</h4>
                <p className="text-sm text-slate-600 mb-3">PostgreSQL tables and RLS policies</p>
                <Badge className="bg-teal-100 text-teal-800">Included in deployment guide</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Checklist */}
        <Card className="mt-6 border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-red-900">
              <Shield className="w-6 h-6" />
              Security Checklist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-red-800">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Never commit API keys to version control
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Always use HTTPS in production
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Validate webhook signatures
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Process payments server-side only
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Use environment variables for all secrets
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Test thoroughly before going live
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
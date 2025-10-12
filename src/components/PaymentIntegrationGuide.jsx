// Complete guide for integrating Stripe payments
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Server, Lock, CheckCircle2 } from 'lucide-react';

export default function PaymentIntegrationGuide() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Stripe Payment Integration Guide</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-green-600" />
            Current Status: NOT CONNECTED
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <p className="text-amber-800">
              ⚠️ Your checkout page currently simulates payments without actually charging customers. 
              You need to integrate Stripe to process real payments.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Step 1: Get Stripe API Keys</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Go to <a href="https://dashboard.stripe.com/register" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">stripe.com</a> and create an account</li>
            <li>Navigate to Developers → API keys</li>
            <li>Copy your Publishable key (starts with pk_)</li>
            <li>Copy your Secret key (starts with sk_)</li>
            <li>Store them as environment variables:
              <div className="bg-slate-100 p-3 rounded mt-2 font-mono text-xs">
                REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...<br/>
                STRIPE_SECRET_KEY=sk_test_...
              </div>
            </li>
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="w-5 h-5 text-blue-600" />
            Step 2: Backend Setup (Required)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-slate-600">You need a backend endpoint to create payment intents. Example for Node.js/Express:</p>
          
          <div className="bg-slate-900 text-slate-100 p-4 rounded-lg text-xs overflow-x-auto">
            <pre>{`// backend/routes/payment.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.post('/create-payment-intent', async (req, res) => {
  const { amount, planName, billingCycle } = req.body;
  
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe uses cents
      currency: 'eur',
      metadata: {
        plan: planName,
        billing_cycle: billingCycle
      }
    });
    
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});`}</pre>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
            <p className="text-sm text-blue-800">
              <strong>For Supabase:</strong> Create an Edge Function for this endpoint
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Step 3: Install Stripe Libraries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-slate-100 p-3 rounded font-mono text-sm">
            npm install @stripe/stripe-js @stripe/react-stripe-js
          </div>
          
          <p className="text-sm text-slate-600 mt-3">These libraries provide secure Stripe payment elements for your React app.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Step 4: Update Checkout Page</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
              <span>Wrap your app with StripeProvider</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
              <span>Use Stripe CardElement for secure card input</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
              <span>Call your backend to create payment intent</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
              <span>Confirm payment with Stripe.js</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
              <span>Update user subscription on success</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-purple-600" />
            Step 5: Webhook Setup (Important!)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-slate-600">
            Set up webhooks to handle subscription lifecycle events:
          </p>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>payment_intent.succeeded - Update subscription to active</li>
            <li>payment_intent.payment_failed - Handle failed payments</li>
            <li>customer.subscription.deleted - Cancel subscription</li>
          </ul>
          
          <div className="bg-slate-100 p-3 rounded mt-3">
            <p className="text-xs text-slate-600">
              Webhook URL: https://yourdomain.com/api/stripe-webhook
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
        <h3 className="font-semibold text-green-800 mb-2">✅ Testing Your Integration</h3>
        <p className="text-sm text-slate-700 mb-3">Use Stripe test cards:</p>
        <div className="bg-white p-3 rounded text-xs font-mono space-y-1">
          <div>Success: 4242 4242 4242 4242</div>
          <div>Declined: 4000 0000 0000 0002</div>
          <div>Requires Auth: 4000 0025 0000 3155</div>
        </div>
      </div>
    </div>
  );
}
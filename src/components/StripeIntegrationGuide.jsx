import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Copy, CheckCircle, CreditCard, Shield, Webhook, Code } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function StripeIntegrationGuide() {
  const [copied, setCopied] = useState('');

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(''), 2000);
  };

  const frontendStripeCode = `// Install: npm install @stripe/stripe-js @stripe/react-stripe-js

// Create src/components/StripePaymentForm.jsx
import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm({ amount, plan, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: \`\${window.location.origin}/payment-success\`,
        },
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Payment successful
        onSuccess(paymentIntent.id);
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {errorMessage && (
        <div className="text-red-600 text-sm mt-2">{errorMessage}</div>
      )}
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg"
      >
        {isProcessing ? 'Processing...' : \`Pay €\${amount}\`}
      </button>
    </form>
  );
}

export default function StripePaymentForm({ amount, plan, onSuccess }) {
  const [clientSecret, setClientSecret] = useState('');

  React.useEffect(() => {
    // Create payment intent when component mounts
    fetch(\`\${import.meta.env.VITE_API_URL}/api/payments/create-payment-intent\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${localStorage.getItem('auth_token')}\`
      },
      body: JSON.stringify({ plan: plan.name, amount })
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [amount, plan]);

  return (
    <div>
      {clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm amount={amount} plan={plan} onSuccess={onSuccess} />
        </Elements>
      )}
    </div>
  );
}`;

  const updateCheckoutPage = `// Update your pages/Checkout.js to use real Stripe

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StripePaymentForm from '../components/StripePaymentForm';
import { User } from '@/api/entities';

export default function CheckoutPage() {
  const [plan, setPlan] = useState(null);
  const navigate = useNavigate();

  // ... keep existing code (get plan from URL params) ...

  const handlePaymentSuccess = async (paymentIntentId) => {
    try {
      // Confirm payment with backend
      const response = await fetch(\`\${import.meta.env.VITE_API_URL}/api/payments/confirm-payment\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${localStorage.getItem('auth_token')}\`
        },
        body: JSON.stringify({ paymentIntentId })
      });

      if (response.ok) {
        // Update local user data
        await User.updateMyUserData({
          subscription_plan: plan.name,
          subscription_status: 'active',
          plan_type: plan.type
        });

        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Payment confirmation error:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Complete Your Purchase</CardTitle>
        </CardHeader>
        <CardContent>
          <StripePaymentForm
            amount={plan.price}
            plan={plan}
            onSuccess={handlePaymentSuccess}
          />
        </CardContent>
      </Card>
    </div>
  );
}`;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-blue-600" />
            Complete Stripe Integration Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Step 1: Get Stripe Account */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Step 1: Set Up Stripe Account
              </h3>
              <ol className="space-y-3 text-sm text-blue-800 list-decimal list-inside">
                <li>Go to <strong>stripe.com</strong> and create an account</li>
                <li>Complete business verification</li>
                <li>Navigate to <strong>Developers → API keys</strong></li>
                <li>Copy your keys (keep them SECRET):
                  <ul className="ml-6 mt-2 space-y-1 list-disc">
                    <li><strong>Publishable key</strong> (pk_test_...) - for frontend</li>
                    <li><strong>Secret key</strong> (sk_test_...) - for backend</li>
                  </ul>
                </li>
              </ol>
            </div>

            {/* Step 2: Add Environment Variables */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-amber-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Step 2: Configure Environment Variables
              </h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-amber-800 mb-2">Backend (Render):</p>
                  <pre className="bg-slate-900 text-slate-100 p-3 rounded text-xs">
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
                  </pre>
                </div>

                <div>
                  <p className="text-sm font-semibold text-amber-800 mb-2">Frontend (.env.local):</p>
                  <pre className="bg-slate-900 text-slate-100 p-3 rounded text-xs">
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
VITE_API_URL=https://your-backend-url.onrender.com
                  </pre>
                </div>
              </div>
            </div>

            {/* Step 3: Install Dependencies */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center gap-2">
                <Code className="w-5 h-5" />
                Step 3: Install Stripe Libraries
              </h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-green-800 mb-2">Backend:</p>
                  <pre className="bg-slate-900 text-slate-100 p-3 rounded text-xs">
npm install stripe
                  </pre>
                </div>

                <div>
                  <p className="text-sm font-semibold text-green-800 mb-2">Frontend:</p>
                  <pre className="bg-slate-900 text-slate-100 p-3 rounded text-xs">
npm install @stripe/stripe-js @stripe/react-stripe-js
                  </pre>
                </div>
              </div>
            </div>

            {/* Step 4: Set Up Webhooks */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center gap-2">
                <Webhook className="w-5 h-5" />
                Step 4: Configure Webhooks
              </h3>
              
              <ol className="space-y-2 text-sm text-purple-800 list-decimal list-inside">
                <li>In Stripe Dashboard, go to <strong>Developers → Webhooks</strong></li>
                <li>Click <strong>Add endpoint</strong></li>
                <li>Enter URL: <code className="bg-purple-100 px-2 py-1 rounded">https://your-backend.onrender.com/api/payments/webhook</code></li>
                <li>Select events to listen for:
                  <ul className="ml-6 mt-2 space-y-1 list-disc">
                    <li>payment_intent.succeeded</li>
                    <li>payment_intent.payment_failed</li>
                    <li>customer.subscription.deleted</li>
                  </ul>
                </li>
                <li>Copy the <strong>Signing secret</strong> (whsec_...)</li>
                <li>Add it to your backend environment variables as STRIPE_WEBHOOK_SECRET</li>
              </ol>
            </div>

            {/* Code Implementation */}
            <Tabs defaultValue="frontend" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="frontend">Frontend Code</TabsTrigger>
                <TabsTrigger value="checkout">Update Checkout</TabsTrigger>
              </TabsList>

              <TabsContent value="frontend">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">components/StripePaymentForm.jsx</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(frontendStripeCode, 'frontend')}
                    >
                      {copied === 'frontend' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-xs max-h-96">
                      {frontendStripeCode}
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="checkout">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">pages/Checkout.js (Updated)</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(updateCheckoutPage, 'checkout')}
                    >
                      {copied === 'checkout' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-xs max-h-96">
                      {updateCheckoutPage}
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Testing */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Testing Your Integration</h3>
              <div className="space-y-3 text-sm text-slate-700">
                <p><strong>Test Card Numbers:</strong></p>
                <ul className="space-y-2 list-disc list-inside ml-4">
                  <li><code className="bg-slate-200 px-2 py-1 rounded">4242 4242 4242 4242</code> - Success</li>
                  <li><code className="bg-slate-200 px-2 py-1 rounded">4000 0000 0000 9995</code> - Declined</li>
                  <li><code className="bg-slate-200 px-2 py-1 rounded">4000 0025 0000 3155</code> - Requires authentication</li>
                </ul>
                <p className="mt-3"><strong>Any future date for expiry, any 3 digits for CVC</strong></p>
              </div>
            </div>

            {/* Security Notes */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Security Checklist
              </h3>
              <ul className="text-sm text-red-800 space-y-1 list-disc list-inside">
                <li>Never commit API keys to GitHub</li>
                <li>Use environment variables for all secrets</li>
                <li>Validate webhooks using Stripe signatures</li>
                <li>Always verify payments server-side</li>
                <li>Use HTTPS in production</li>
                <li>Enable PCI compliance features in Stripe</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
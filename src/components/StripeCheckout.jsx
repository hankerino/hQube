import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CreditCard, Lock, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// This component will handle Stripe payment processing
// Note: You'll need to install @stripe/stripe-js and @stripe/react-stripe-js

export default function StripeCheckout({ plan, billingCycle, onSuccess }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Backend API URL - update this with your actual backend URL
  const API_URL = import.meta.env.VITE_API_URL || 'https://your-backend-url.com';

  const handleStripePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Call your backend to create a Stripe Payment Intent
      const response = await fetch(`${API_URL}/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          plan: plan.name,
          planType: plan.type,
          billingCycle: billingCycle,
          amount: billingCycle === 'yearly' ? plan.price.yearly : plan.price.monthly
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret } = await response.json();

      // Confirm the payment with Stripe
      // This is where actual Stripe payment would happen
      // You'll need to use Stripe Elements or Stripe.js here

      toast({
        title: "Payment Successful!",
        description: `Your ${billingCycle} subscription to the ${plan.name} plan is now active.`,
        className: "bg-green-500 text-white",
      });

      if (onSuccess) onSuccess();

    } catch (error) {
      console.error('Stripe payment error:', error);
      toast({
        title: "Payment Failed",
        description: "There was an issue processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <CreditCard className="w-6 h-6 text-amber-600" />
          Secure Payment with Stripe
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-900 mb-1">
                Stripe Integration Not Connected
              </p>
              <p className="text-xs text-amber-800">
                This is a placeholder component. To process real payments, you need to:
              </p>
              <ul className="text-xs text-amber-800 mt-2 space-y-1 list-disc list-inside">
                <li>Set up a Stripe account and get API keys</li>
                <li>Install @stripe/stripe-js and @stripe/react-stripe-js</li>
                <li>Create a backend endpoint for payment processing</li>
                <li>Update this component with Stripe Elements</li>
              </ul>
            </div>
          </div>
        </div>

        <form onSubmit={handleStripePayment}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="card-name">Name on Card</Label>
              <Input 
                id="card-name" 
                placeholder="John Doe" 
                required 
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="card-email">Email</Label>
              <Input 
                id="card-email" 
                type="email"
                placeholder="john@example.com" 
                required 
                className="mt-1"
              />
            </div>
            
            {/* Stripe Card Element would go here */}
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center bg-slate-50">
              <CreditCard className="w-12 h-12 mx-auto text-slate-400 mb-2" />
              <p className="text-sm font-medium text-slate-600">
                Stripe Card Element Placeholder
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Install @stripe/react-stripe-js to enable secure card input
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-800">
                <Lock className="w-3 h-3 inline mr-1" />
                Your payment information would be securely processed by Stripe
              </p>
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isProcessing} 
            className="w-full mt-6 bg-amber-600 hover:bg-amber-700 text-lg py-6"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <Lock className="w-5 h-5 mr-2" />
                Pay {plan.price[billingCycle]}
              </>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center text-xs text-slate-500">
        <Lock className="w-3 h-3 mr-1" />
        Secured by Stripe • PCI Compliant
      </CardFooter>
    </Card>
  );
}
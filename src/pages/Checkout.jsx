
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiClient } from '@/utils/apiClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { Lock, ShieldCheck, CheckCircle, CreditCard, ArrowLeft, Wallet } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// A simple component to represent the PayPal button
const PayPalIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2">
    {/* This is a generic icon based on the provided path in the outline, not an official PayPal logo */}
    <path d="M11.5 16.5c1.93 0 3.5-1.57 3.5-3.5s-1.57-3.5-3.5-3.5-3.5 1.57-3.5 3.5 1.57 3.5 3.5 3.5z"/>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
    <path d="M8.5 12H12"/>
  </svg>
);


export default function CheckoutPage() {
  const [plan, setPlan] = useState(null);
  const [billingCycle, setBillingCycle] = useState('yearly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card'); // New state for selected payment method
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const planName = params.get('plan');
    const planType = params.get('type');
    const planPrice = params.get('price');
    const planPeriod = params.get('period');
    const cycle = params.get('cycle');

    if (planName && planType && planPrice && cycle) {
      setPlan({ name: planName, type: planType, price: planPrice, period: planPeriod });
      setBillingCycle(cycle);
    } else {
        navigate(createPageUrl("Home"));
    }
  }, [location.search, navigate]);

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing based on selected method
    if (paymentMethod === 'card') {
      try {
        // Simulate API call for card payment
        await apiClient.updateMe({
          subscription_plan: plan.name,
          plan_type: plan.type,
          subscription_status: 'active',
          billing_cycle: billingCycle,
        });
        
        toast({
          title: "Payment Successful!",
          description: `Your ${billingCycle} subscription to the ${plan.name} plan is now active.`,
          className: "bg-green-500 text-white",
        });

        setTimeout(() => navigate(createPageUrl('Dashboard')), 2000);

      } catch (error) {
        toast({
          title: "Payment Failed",
          description: "There was an issue processing your subscription. Please try again.",
          variant: "destructive",
        });
        setIsProcessing(false);
      }
    } else {
      // Simulate external payment gateway redirection/connection
      let message = "";
      if (paymentMethod === 'paypal') {
        message = "Initiating PayPal redirection...";
      } else if (paymentMethod === 'crypto') {
        message = "Opening wallet connection...";
      }

      toast({
        title: "Action Initiated",
        description: message + " (Simulated for demo purposes)",
        className: "bg-blue-500 text-white",
      });

      // Simulate a delay for the external process and then success
      setTimeout(async () => {
        try {
          // In a real app, this would be a callback from the payment gateway
          await apiClient.updateMe({
            subscription_plan: plan.name,
            plan_type: plan.type,
            subscription_status: 'active',
            billing_cycle: billingCycle,
          });

          toast({
            title: "Payment Processed (Simulated)",
            description: `Your ${billingCycle} subscription to the ${plan.name} plan is now active via ${paymentMethod}.`,
            className: "bg-green-500 text-white",
          });
          setTimeout(() => navigate(createPageUrl('Dashboard')), 1500);
        } catch (error) {
          toast({
            title: "Payment Failed (Simulated)",
            description: "There was an issue processing your subscription via the external gateway. Please try again.",
            variant: "destructive",
          });
          setIsProcessing(false);
        }
      }, 2000); // Simulate processing time for external methods
    }
  };

  if (!plan) return null;

  const planColors = {
    cybersecurity: {
      primary: 'bg-amber-600 hover:bg-amber-700',
      secondary: 'bg-amber-100 text-amber-800 border-amber-200'
    },
    servicenow: {
      primary: 'bg-teal-600 hover:bg-teal-700', 
      secondary: 'bg-teal-100 text-teal-800 border-teal-200'
    }
  };

  const currentColors = planColors[plan.type] || planColors.cybersecurity;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 p-8">
      <Toaster />
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => navigate(createPageUrl("Home"))} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Plans
        </Button>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Secure Checkout</h1>
          <p className="text-lg text-slate-600">Complete your subscription for the <span className="font-semibold text-amber-700">{plan.name}</span> plan.</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 mt-8 items-start">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <form onSubmit={handlePayment}>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3"><CreditCard className="w-6 h-6 text-amber-600" /> Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs value={paymentMethod} onValueChange={setPaymentMethod} className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="card"><CreditCard className="w-4 h-4 mr-1"/>Card</TabsTrigger>
                      <TabsTrigger value="paypal"><PayPalIcon />PayPal</TabsTrigger>
                      <TabsTrigger value="crypto"><Wallet className="w-4 h-4 mr-1"/>Crypto</TabsTrigger>
                    </TabsList>
                    <TabsContent value="card" className="mt-6 space-y-4">
                      <div>
                        <Label htmlFor="card-name">Name on Card</Label>
                        <Input id="card-name" placeholder="John Doe" required={paymentMethod === 'card'} />
                      </div>
                      <div>
                        <Label htmlFor="card-number">Card Number</Label>
                        <Input id="card-number" placeholder="•••• •••• •••• ••••" required={paymentMethod === 'card'} />
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input id="expiry" placeholder="MM / YY" required={paymentMethod === 'card'} />
                        </div>
                        <div className="flex-1">
                          <Label htmlFor="cvc">CVC</Label>
                          <Input id="cvc" placeholder="•••" required={paymentMethod === 'card'} />
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="paypal" className="mt-6 text-center">
                      <p className="text-slate-600 mb-4">You will be redirected to PayPal to complete your purchase securely.</p>
                      <Button type="button" variant="outline" className="w-full py-6 text-lg border-blue-600 text-blue-700 hover:bg-blue-50 hover:text-blue-800" onClick={() => {
                        toast({
                          title: "PayPal Selected",
                          description: "Click 'Pay' below to simulate PayPal redirection.",
                          className: "bg-blue-500 text-white",
                        });
                      }}>
                        <PayPalIcon /> Continue with PayPal
                      </Button>
                    </TabsContent>
                    <TabsContent value="crypto" className="mt-6 text-center">
                       <p className="text-slate-600 mb-4">Select your wallet and complete the transaction on the blockchain.</p>
                       <Button type="button" variant="outline" className="w-full py-6 text-lg border-amber-500 text-amber-700 hover:bg-amber-50 hover:text-amber-800" onClick={() => {
                         toast({
                          title: "Crypto Selected",
                          description: "Click 'Pay' below to simulate crypto wallet connection.",
                          className: "bg-blue-500 text-white",
                         });
                       }}>
                        <Wallet className="w-5 h-5 mr-2"/> Connect Wallet
                      </Button>
                       <p className="text-xs text-slate-500 mt-4">Supports BTC, ETH, USDC on main networks.</p>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter className="flex-col items-stretch">
                  <Button type="submit" disabled={isProcessing} className={`w-full ${currentColors.primary} text-lg py-6`}>
                    {isProcessing ? <Lock className="w-5 h-5 mr-2 animate-spin" /> : <Lock className="w-5 h-5 mr-2" />}
                    {isProcessing ? "Processing..." : `Pay ${plan.price}${plan.period}`}
                  </Button>
                  <div className="flex justify-center items-center mt-4 text-xs text-slate-500 gap-2">
                    <Lock className="w-3 h-3"/>
                    <span>Secure SSL Encrypted Payment</span>
                  </div>
                </CardFooter>
              </Card>
            </form>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center py-4 border-b">
                  <span className="text-slate-600">{plan.name} ({plan.type})</span>
                  <span className="font-semibold text-slate-800">{plan.price}{plan.period}</span>
                </div>
                <div className="flex justify-between items-center py-2 text-sm text-slate-500">
                  <span>Billing Period</span>
                  <span className="capitalize">{billingCycle}</span>
                </div>
                {billingCycle === 'yearly' &&
                  <div className="flex justify-between items-center py-2 text-sm text-green-600">
                    <span>Annual Savings</span>
                    <span>Up to 20% off monthly pricing</span>
                  </div>
                }
                <div className="flex justify-between items-center py-4 font-bold text-lg border-t">
                  <span className="text-slate-800">Total Due Today</span>
                  <span className="text-teal-700">{plan.price}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className={`shadow-lg ${plan.type === 'cybersecurity' ? 'bg-amber-50 border-amber-200' : 'bg-teal-50 border-teal-200'}`}>
                <CardHeader>
                    <CardTitle className={`${plan.type === 'cybersecurity' ? 'text-amber-800' : 'text-teal-800'} text-lg`}>Our Security Promise</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                        <ShieldCheck className={`w-6 h-6 ${plan.type === 'cybersecurity' ? 'text-amber-600' : 'text-teal-600'} flex-shrink-0`} />
                        <p className={`text-sm ${plan.type === 'cybersecurity' ? 'text-amber-700' : 'text-teal-700'}`}>
                            <span className="font-semibold">Zero Trust Authentication:</span> Your identity is verified at every step.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <CheckCircle className={`w-6 h-6 ${plan.type === 'cybersecurity' ? 'text-amber-600' : 'text-teal-600'} flex-shrink-0`} />
                        <p className={`text-sm ${plan.type === 'cybersecurity' ? 'text-amber-700' : 'text-teal-700'}`}>
                           <span className="font-semibold">Secured by Context7 MCP:</span> Your data is protected by a Mobile-Cloud Protect architecture.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <CheckCircle className={`w-6 h-6 ${plan.type === 'cybersecurity' ? 'text-amber-600' : 'text-teal-600'} flex-shrink-0`} />
                        <p className={`text-sm ${plan.type === 'cybersecurity' ? 'text-amber-700' : 'text-teal-700'}`}>
                           <span className="font-semibold">30-Day Cancellation Policy:</span> Cancel anytime within the first 30 days for any reason.
                        </p>
                    </div>
                </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}


import React, { useState, useEffect } from 'react';
import { apiClient } from '@/utils/apiClient';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowLeft, ShieldCheck, Server, RefreshCw, XCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ManageSubscriptionPage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const { user: currentUser } = await apiClient.getMe();
        setUser(currentUser);
      } catch (error) {
        navigate(createPageUrl('Home'));
      }
      setIsLoading(false);
    };
    fetchUser();
  }, [navigate]);

  const handleCancelSubscription = async () => {
    setIsCancelling(true);
    try {
      await apiClient.updateMe({
        subscription_plan: 'None',
        plan_type: 'none',
        subscription_status: 'cancelled',
        billing_cycle: 'none',
      });
      toast({
        title: "Subscription Cancelled",
        description: "Your hQube subscription has been successfully cancelled.",
      });
      // Refetch user data to update UI
      const { user: updatedUser } = await apiClient.getMe();
      setUser(updatedUser);
    } catch (error) {
      toast({
        title: "Cancellation Failed",
        description: "Could not cancel your subscription. Please contact support.",
        variant: "destructive",
      });
    }
    setIsCancelling(false);
  };
  
  const PlanIcon = ({ planType }) => {
    if (planType === 'cybersecurity') return <ShieldCheck className="w-8 h-8 text-teal-600" />;
    if (planType === 'servicenow') return <Server className="w-8 h-8 text-teal-600" />;
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <Loader2 className="w-12 h-12 text-teal-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 p-8">
      <Toaster />
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" onClick={() => navigate(createPageUrl("Dashboard"))} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-4xl font-bold text-slate-800 mb-6">Manage Subscription</h1>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Your Current Plan</CardTitle>
            <CardDescription>View, change, or cancel your subscription.</CardDescription>
          </CardHeader>
          <CardContent className="text-center py-8">
            {user.subscription_status === 'active' ? (
              <>
                <PlanIcon planType={user.plan_type} />
                <p className="font-bold text-3xl text-slate-800 mt-4">{user.subscription_plan}</p>
                <div className="flex items-center justify-center gap-2 mt-2">
                   <Badge className="bg-green-100 text-green-800 text-sm">{user.subscription_status}</Badge>
                   <Badge variant="secondary" className="text-sm capitalize">{user.plan_type}</Badge>
                   {user.billing_cycle && <Badge variant="outline" className="text-sm capitalize">{user.billing_cycle}</Badge>}
                </div>
              </>
            ) : (
              <>
                <p className="text-2xl font-semibold text-slate-600">No Active Subscription</p>
                <p className="text-slate-500 mt-2">Your subscription is currently inactive.</p>
              </>
            )}
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-4">
            <Button asChild className="w-full bg-slate-600 hover:bg-slate-700">
              <Link to={createPageUrl("Home") + "#plans"}>
                <RefreshCw className="w-4 h-4 mr-2" />
                {user.subscription_status === 'active' ? 'Change Plan' : 'Explore Plans'}
              </Link>
            </Button>
            {user.subscription_status === 'active' && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    <XCircle className="w-4 h-4 mr-2" />
                    Cancel Subscription
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will cancel your subscription. You can cancel for any reason within the first 30 days. After that period, your access will continue until the end of your current billing cycle. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Go Back</AlertDialogCancel>
                    <AlertDialogAction onClick={handleCancelSubscription} disabled={isCancelling}>
                      {isCancelling && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      Yes, Cancel Subscription
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

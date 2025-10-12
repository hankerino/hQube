
import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { AnalysisRequest } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, UserCircle, FileClock, ShieldCheck, Server, Settings } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const currentUser = await User.me();
        setUser(currentUser);
        
        if (currentUser) {
          const history = await AnalysisRequest.filter({ created_by: currentUser.email }, '-created_date', 10);
          setAnalysisHistory(history);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const PlanIcon = ({ planType }) => {
    if (planType === 'cybersecurity') return <ShieldCheck className="w-5 h-5 text-teal-600" />;
    if (planType === 'servicenow') return <Server className="w-5 h-5 text-teal-600" />;
    return null;
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <Loader2 className="w-12 h-12 text-teal-600 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-semibold">Please log in to view your dashboard.</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Welcome back, {user.full_name || 'User'}!</h1>
          <p className="text-lg text-slate-600">Here's your hQube dashboard.</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          <motion.div className="lg:col-span-1 space-y-8" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3"><UserCircle className="w-6 h-6 text-teal-600" /> Your Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="font-semibold text-slate-800">{user.full_name}</p>
                <p className="text-slate-600">{user.email}</p>
                <p className="text-sm text-slate-500">Member since {format(new Date(user.created_date), 'MMMM yyyy')}</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3"><PlanIcon planType={user.plan_type} /> Current Subscription</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {user.subscription_plan && user.subscription_status === 'active' ? (
                  <>
                    <p className="font-bold text-2xl text-slate-800">{user.subscription_plan}</p>
                    <div className="flex items-center gap-2">
                       <Badge className="bg-green-100 text-green-800">{user.subscription_status}</Badge>
                       <Badge variant="secondary">{user.plan_type}</Badge>
                    </div>
                  </>
                ) : (
                  <p className="text-slate-500">No active subscription. Explore our plans!</p>
                )}
                 <Button onClick={() => navigate(createPageUrl('ManageSubscription'))} className="w-full mt-2 bg-teal-600 hover:bg-teal-700">
                   <Settings className="w-4 h-4 mr-2" />
                   Manage Subscription
                 </Button>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div className="lg:col-span-2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <Card className="shadow-lg h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-3"><FileClock className="w-6 h-6 text-teal-600" /> Recent Analysis Requests</CardTitle>
                <CardDescription>Your last 10 document analyses.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysisHistory.length > 0 ? (
                    analysisHistory.map(req => (
                      <div key={req.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-semibold text-slate-800">{req.file_name}</p>
                          <p className="text-sm text-slate-500">{format(new Date(req.created_date), 'PP pp')}</p>
                        </div>
                        <Badge variant={req.status === 'completed' ? 'default' : 'destructive'} className={req.status === 'completed' ? 'bg-green-100 text-green-800' : ''}>
                          {req.status}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-slate-500 py-8">You haven't analyzed any documents yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

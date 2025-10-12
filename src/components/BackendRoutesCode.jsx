import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, CheckCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function BackendRoutesCode() {
  const [copied, setCopied] = useState('');

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(''), 2000);
  };

  const usersRoute = `const express = require('express');
const router = express.Router();
const db = require('../utils/database');
const { authenticateToken } = require('../middleware/auth');

// Get user profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, email, full_name, role, subscription_plan, subscription_status, plan_type, billing_cycle, created_date FROM users WHERE id = $1',
      [req.user.userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user data' });
  }
});

// Update user profile
router.put('/me', authenticateToken, async (req, res) => {
  try {
    const { full_name, subscription_plan, subscription_status, plan_type, billing_cycle } = req.body;
    
    const result = await db.query(
      \`UPDATE users 
       SET full_name = COALESCE($1, full_name),
           subscription_plan = COALESCE($2, subscription_plan),
           subscription_status = COALESCE($3, subscription_status),
           plan_type = COALESCE($4, plan_type),
           billing_cycle = COALESCE($5, billing_cycle),
           updated_date = NOW()
       WHERE id = $6
       RETURNING id, email, full_name, role, subscription_plan, subscription_status, plan_type, billing_cycle\`,
      [full_name, subscription_plan, subscription_status, plan_type, billing_cycle, req.user.userId]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user data' });
  }
});

// Get all users (admin only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    const userCheck = await db.query('SELECT role FROM users WHERE id = $1', [req.user.userId]);
    if (userCheck.rows[0].role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const result = await db.query(
      'SELECT id, email, full_name, role, subscription_plan, subscription_status, created_date FROM users ORDER BY created_date DESC'
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

module.exports = router;`;

  const analysisRoute = `const express = require('express');
const router = express.Router();
const db = require('../utils/database');
const { authenticateToken } = require('../middleware/auth');
const OpenAI = require('openai');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Create analysis request
router.post('/', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    const { file_name, file_url } = req.body;
    
    const result = await db.query(
      \`INSERT INTO analysis_requests (file_name, file_url, status, created_by) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *\`,
      [file_name, file_url, 'pending', req.user.email]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Create analysis error:', error);
    res.status(500).json({ error: 'Failed to create analysis request' });
  }
});

// Get user's analysis requests
router.get('/my-requests', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM analysis_requests WHERE created_by = $1 ORDER BY created_date DESC LIMIT 10',
      [req.user.email]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get analysis requests error:', error);
    res.status(500).json({ error: 'Failed to get analysis requests' });
  }
});

// Update analysis request
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { analysis_summary, status } = req.body;
    
    // Check ownership
    const checkResult = await db.query(
      'SELECT created_by FROM analysis_requests WHERE id = $1',
      [id]
    );
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Analysis request not found' });
    }
    
    if (checkResult.rows[0].created_by !== req.user.email) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    const result = await db.query(
      \`UPDATE analysis_requests 
       SET analysis_summary = COALESCE($1, analysis_summary),
           status = COALESCE($2, status),
           updated_date = NOW()
       WHERE id = $3
       RETURNING *\`,
      [analysis_summary, status, id]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update analysis error:', error);
    res.status(500).json({ error: 'Failed to update analysis request' });
  }
});

// Analyze document with OpenAI
router.post('/analyze', authenticateToken, async (req, res) => {
  try {
    const { file_content, file_name } = req.body;
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a cybersecurity expert analyzing documents for security risks and compliance issues."
        },
        {
          role: "user",
          content: \`Analyze this document and provide a security assessment. Document name: \${file_name}. Content: \${file_content}\`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });
    
    res.json({ analysis: completion.choices[0].message.content });
  } catch (error) {
    console.error('OpenAI analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze document' });
  }
});

module.exports = router;`;

  const ticketsRoute = `const express = require('express');
const router = express.Router();
const db = require('../utils/database');
const { authenticateToken } = require('../middleware/auth');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Create support ticket
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { request_type, details } = req.body;
    
    const result = await db.query(
      \`INSERT INTO support_tickets (user_email, request_type, details, status) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *\`,
      [req.user.email, request_type, details, 'new']
    );
    
    // Send email notification to support team
    try {
      await sgMail.send({
        to: 'support@hqube.co',
        from: 'noreply@hqube.co',
        subject: \`New Support Ticket: \${request_type}\`,
        text: \`New ticket from \${req.user.email}\\n\\nType: \${request_type}\\n\\nDetails:\\n\${details}\`,
        html: \`
          <h2>New Support Ticket</h2>
          <p><strong>From:</strong> \${req.user.email}</p>
          <p><strong>Type:</strong> \${request_type}</p>
          <h3>Details:</h3>
          <p>\${details.replace(/\\n/g, '<br>')}</p>
        \`
      });
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
      // Don't fail the request if email fails
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({ error: 'Failed to create support ticket' });
  }
});

// Get user's tickets
router.get('/my-tickets', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM support_tickets WHERE user_email = $1 ORDER BY created_date DESC',
      [req.user.email]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({ error: 'Failed to get tickets' });
  }
});

// Get all tickets (admin only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    const userCheck = await db.query('SELECT role FROM users WHERE email = $1', [req.user.email]);
    if (userCheck.rows[0].role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const result = await db.query(
      'SELECT * FROM support_tickets ORDER BY created_date DESC'
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get all tickets error:', error);
    res.status(500).json({ error: 'Failed to get tickets' });
  }
});

// Update ticket status (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Check if user is admin
    const userCheck = await db.query('SELECT role FROM users WHERE email = $1', [req.user.email]);
    if (userCheck.rows[0].role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const result = await db.query(
      \`UPDATE support_tickets 
       SET status = $1, updated_date = NOW()
       WHERE id = $2
       RETURNING *\`,
      [status, id]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update ticket error:', error);
    res.status(500).json({ error: 'Failed to update ticket' });
  }
});

module.exports = router;`;

  const paymentsRoute = `const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const db = require('../utils/database');
const { authenticateToken } = require('../middleware/auth');

// Create payment intent
router.post('/create-payment-intent', authenticateToken, async (req, res) => {
  try {
    const { plan, planType, billingCycle, amount } = req.body;
    
    // Parse amount (remove currency symbols and convert to cents)
    const amountValue = parseInt(amount.replace(/[^0-9]/g, '')) * 100;
    
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountValue,
      currency: 'eur',
      metadata: {
        userId: req.user.userId,
        userEmail: req.user.email,
        plan: plan,
        planType: planType,
        billingCycle: billingCycle
      },
      description: \`hQube \${plan} Plan - \${billingCycle}\`
    });
    
    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});

// Confirm payment and update subscription
router.post('/confirm-payment', authenticateToken, async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    
    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status === 'succeeded') {
      // Update user subscription in database
      const { plan, planType, billingCycle } = paymentIntent.metadata;
      
      await db.query(
        \`UPDATE users 
         SET subscription_plan = $1,
             plan_type = $2,
             billing_cycle = $3,
             subscription_status = 'active',
             updated_date = NOW()
         WHERE id = $4\`,
        [plan, planType, billingCycle, req.user.userId]
      );
      
      res.json({ 
        success: true, 
        message: 'Payment successful and subscription activated' 
      });
    } else {
      res.status(400).json({ error: 'Payment not completed' });
    }
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ error: 'Failed to confirm payment' });
  }
});

// Stripe webhook handler
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(\`Webhook Error: \${err.message}\`);
  }
  
  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('PaymentIntent was successful:', paymentIntent.id);
      
      // Update user subscription
      try {
        await db.query(
          \`UPDATE users 
           SET subscription_plan = $1,
               plan_type = $2,
               billing_cycle = $3,
               subscription_status = 'active',
               updated_date = NOW()
           WHERE email = $4\`,
          [
            paymentIntent.metadata.plan,
            paymentIntent.metadata.planType,
            paymentIntent.metadata.billingCycle,
            paymentIntent.metadata.userEmail
          ]
        );
      } catch (dbError) {
        console.error('Database update error:', dbError);
      }
      break;
      
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('PaymentIntent failed:', failedPayment.id);
      break;
      
    case 'customer.subscription.deleted':
      const subscription = event.data.object;
      console.log('Subscription cancelled:', subscription.id);
      
      // Update user subscription status
      try {
        await db.query(
          \`UPDATE users 
           SET subscription_status = 'cancelled',
               updated_date = NOW()
           WHERE email = $1\`,
          [subscription.metadata.userEmail]
        );
      } catch (dbError) {
        console.error('Database update error:', dbError);
      }
      break;
      
    default:
      console.log(\`Unhandled event type \${event.type}\`);
  }
  
  res.json({ received: true });
});

// Get customer's payment methods
router.get('/payment-methods', authenticateToken, async (req, res) => {
  try {
    // Get user from database
    const userResult = await db.query(
      'SELECT stripe_customer_id FROM users WHERE id = $1',
      [req.user.userId]
    );
    
    if (!userResult.rows[0].stripe_customer_id) {
      return res.json({ paymentMethods: [] });
    }
    
    const paymentMethods = await stripe.paymentMethods.list({
      customer: userResult.rows[0].stripe_customer_id,
      type: 'card',
    });
    
    res.json({ paymentMethods: paymentMethods.data });
  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({ error: 'Failed to get payment methods' });
  }
});

// Cancel subscription
router.post('/cancel-subscription', authenticateToken, async (req, res) => {
  try {
    // Update user subscription status
    await db.query(
      \`UPDATE users 
       SET subscription_status = 'cancelled',
           updated_date = NOW()
       WHERE id = $1\`,
      [req.user.userId]
    );
    
    res.json({ success: true, message: 'Subscription cancelled' });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

module.exports = router;`;

  const authMiddleware = `const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    
    req.user = user;
    next();
  });
}

module.exports = { authenticateToken };`;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Backend Routes - Complete Code</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600 mb-4">
            Copy each file below into your backend repository structure:
          </p>
          
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
              <TabsTrigger value="users">users.js</TabsTrigger>
              <TabsTrigger value="analysis">analysis.js</TabsTrigger>
              <TabsTrigger value="tickets">tickets.js</TabsTrigger>
              <TabsTrigger value="payments">payments.js</TabsTrigger>
              <TabsTrigger value="middleware">auth.js</TabsTrigger>
            </TabsList>

            <TabsContent value="users">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">routes/users.js</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(usersRoute, 'users')}
                  >
                    {copied === 'users' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </CardHeader>
                <CardContent>
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-xs max-h-96">
                    {usersRoute}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analysis">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">routes/analysis.js</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(analysisRoute, 'analysis')}
                  >
                    {copied === 'analysis' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </CardHeader>
                <CardContent>
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-xs max-h-96">
                    {analysisRoute}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tickets">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">routes/tickets.js</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(ticketsRoute, 'tickets')}
                  >
                    {copied === 'tickets' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </CardHeader>
                <CardContent>
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-xs max-h-96">
                    {ticketsRoute}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">routes/payments.js (Stripe)</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(paymentsRoute, 'payments')}
                  >
                    {copied === 'payments' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </CardHeader>
                <CardContent>
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-xs max-h-96">
                    {paymentsRoute}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="middleware">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">middleware/auth.js</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(authMiddleware, 'middleware')}
                  >
                    {copied === 'middleware' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </CardHeader>
                <CardContent>
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-xs max-h-96">
                    {authMiddleware}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
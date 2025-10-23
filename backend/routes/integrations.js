const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const nodemailer = require('nodemailer');

// Conditionally initialize Nodemailer transporter
let transporter;
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SMTP_HOST !== 'your-hostinger-smtp-host') {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true, // use true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
} else {
  console.warn('SMTP credentials not found or are placeholders. Email functionality will be disabled.');
}

// Conditionally initialize OpenAI client
let openai;
if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-key') {
    openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });
} else {
    console.warn('OpenAI API key not found or is a placeholder. LLM functionality will be disabled.');
}

router.post('/llm', async (req, res) => {
  if (!openai) {
    return res.status(503).json({ error: 'LLM service is not configured. Please set OPENAI_API_KEY in the environment variables.' });
  }
  try {
    const { prompt, response_json_schema } = req.body;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: response_json_schema ? { type: 'json_object' } : undefined
    });

    const result = completion.choices[0].message.content;

    res.json({
      result: response_json_schema ? JSON.parse(result) : result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/email', async (req, res) => {
  if (!transporter) {
    return res.status(503).json({ error: 'Email service is not configured. Please set SMTP variables in the environment.' });
  }
  try {
    const { to, subject, body, from_name } = req.body;

    const msg = {
      to,
      from: `"${from_name || 'hQube'}" <${process.env.FROM_EMAIL || 'noreply@hqube.co'}>`,
      subject,
      text: body,
      html: body.replace(/\n/g, '<br>')
    };

    await transporter.sendMail(msg);

    res.json({ message: 'Email sent successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
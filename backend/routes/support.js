const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const verifyToken = require('../middleware/auth');

router.post('/tickets', verifyToken, async (req, res) => {
  try {
    const { request_type, details } = req.body;
    const { rows } = await pool.query(
      'INSERT INTO support_tickets (user_email, request_type, details, status, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.user.email, request_type, details, 'new', req.user.userId]
    );
    res.status(201).json({ ticket: rows[0] });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/tickets', verifyToken, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM support_tickets WHERE created_by = $1 ORDER BY created_date DESC',
      [req.user.userId]
    );
    res.json({ tickets: rows });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
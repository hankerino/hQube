const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const verifyToken = require('../middleware/auth');

router.get('/me', verifyToken, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, email, full_name FROM users WHERE id = $1', [req.user.userId]);
    res.json({ user: rows[0] });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

router.patch('/me', verifyToken, async (req, res) => {
  try {
    const { full_name, email } = req.body;
    const { rows } = await pool.query(
      'UPDATE users SET full_name = $1, email = $2 WHERE id = $3 RETURNING id, email, full_name',
      [full_name, email, req.user.userId]
    );
    res.json({ user: rows[0] });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
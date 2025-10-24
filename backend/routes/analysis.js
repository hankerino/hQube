const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const verifyToken = require('../middleware/auth');

router.post('/', verifyToken, async (req, res) => {
  try {
    const { file_name, file_url, analysis_summary, status } = req.body;
    const { rows } = await pool.query(
      'INSERT INTO analysis_requests (file_name, file_url, analysis_summary, status, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [file_name, file_url, analysis_summary, status, req.user.userId]
    );
    res.status(201).json({ analysis: rows[0] });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', verifyToken, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM analysis_requests WHERE created_by = $1 ORDER BY created_date DESC',
      [req.user.userId]
    );
    res.json({ analyses: rows });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
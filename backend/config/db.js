const { Pool } = require('pg');
require('dotenv').config();

const isInvalidUrl = (url) => !url || url === 'your-render-postgresql-url';

let pool;

if (isInvalidUrl(process.env.DATABASE_URL)) {
  console.warn('⚠️ PostgreSQL DATABASE_URL is not set or is a placeholder. Database functionality will be disabled.');
  // Create a mock pool that will throw an error if used
  pool = {
    connect: () => Promise.reject(new Error('Database is not configured.')),
    query: () => Promise.reject(new Error('Database is not configured.')),
    end: () => Promise.resolve(),
  };
} else {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 10000, // 10-second timeout
    ssl: {
      rejectUnauthorized: false
    }
  });
}

module.exports = { pool };

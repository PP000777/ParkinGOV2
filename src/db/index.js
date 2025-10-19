const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // ssl: { rejectUnauthorized: false } // habilite se for preciso (ex: Heroku)
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

pool.connect()
  .then(() => console.log('✅ Conectado ao banco de dados PostgreSQL'))
  .catch(err => console.error('❌ Erro na conexão com o banco de dados:', err.message));

module.exports = pool;

const { Pool } = require('pg');
require('dotenv').config();

/**
 * Criamos uma instância global de pool para evitar múltiplas conexões.
 * Isso melhora muito a performance em produção.
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

/**
 * Envolvemos o pool.query para logs úteis em caso de erro.
 */
module.exports = {
  query: async (text, params) => {
    try {
      return await pool.query(text, params);
    } catch (err) {
      console.error("❌ Erro na consulta SQL:");
      console.error("Query:", text);
      console.error("Params:", params);
      console.error("Detalhes:", err);
      throw err;
    }
  },

  pool,
};

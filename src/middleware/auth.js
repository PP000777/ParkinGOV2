const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Middleware de autenticação JWT.
 * Valida o token enviado no header `Authorization: Bearer <token>`.
 */
const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization;

  // Nenhum token enviado
  if (!header) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  /**
   * Ex.: "Bearer xxxxxxxxx"
   */
  const [scheme, token] = header.split(' ');

  // Checa formatação correta do header
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Token mal formatado' });
  }

  try {
    // Verifica e decodifica o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    /**
     * Armazena os dados do usuário logado
     * Ex: { id: 1, email: "...", plano: "...", iat, exp }
     */
    req.user = decoded;

    return next();

  } catch (err) {
    console.error("❌ Erro ao validar token:", err);
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};

module.exports = authMiddleware;

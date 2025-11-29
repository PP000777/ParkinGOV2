/**
 * Valida email com regex moderna e segura
 */
exports.isEmail = (email) => {
  if (!email || typeof email !== 'string') return false;

  // Regex segura (não exagerada) para validação de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email.trim());
};

/**
 * Verifica se o valor NÃO está vazio
 */
exports.isNotEmpty = (value) => {
  if (value === undefined || value === null) return false;

  // Caso seja número, considera válido
  if (typeof value === 'number') return true;

  return value.toString().trim().length > 0;
};

/**
 * Valida comprimento mínimo de string
 */
exports.hasMinLength = (value, min) => {
  if (!value || typeof value !== 'string') return false;
  return value.trim().length >= min;
};

/**
 * (Opcional) Valida senhas fortes
 * - 1 letra minúscula
 * - 1 letra maiúscula
 * - 1 número
 * - 1 caractere especial
 * - Min 8 caracteres
 */
exports.isStrongPassword = (password) => {
  if (!password || typeof password !== 'string') return false;

  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#._-])[A-Za-z\d@$!%*?&#._-]{8,}$/;

  return regex.test(password);
};

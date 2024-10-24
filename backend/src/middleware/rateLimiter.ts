// src/middleware/rateLimiter.ts
import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Limite de 100 requisições por 15 minutos por IP
    message: 'Muitas requisições feitas a partir deste IP, por favor tente novamente mais tarde.',
    headers: true,
});
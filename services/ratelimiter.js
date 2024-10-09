const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({ // rate limiter 5 mins 5 requests
    windowMs: 5 * 60 * 1000,
    max: 5,
    message: { error: "Too many requests, try again later." }
});

module.exports = rateLimiter;
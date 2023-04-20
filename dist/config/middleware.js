"use strict";
// middleware options
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimitOptionsList = exports.rateLimitOptions = exports.corsOptions = void 0;
// cors
exports.corsOptions = {
    origin: "https://rashidshamloo.github.io",
    optionsSuccessStatus: 200,
};
// rate-limit
exports.rateLimitOptions = {
    // time window in ms: 1 day
    windowMs: 24 * 60 * 60 * 1000,
    // max requests per IP per window
    max: 100,
    // enable `RateLimit-` headers
    standardHeaders: true,
    // disable `X-RateLimit-` headers
    legacyHeaders: false,
};
// rate-limit for api list
exports.rateLimitOptionsList = {
    // time window in ms: 1 day
    windowMs: 24 * 60 * 60 * 1000,
    // max requests per IP per window
    max: 1000,
    // enable `RateLimit-` headers
    standardHeaders: true,
    // disable `X-RateLimit-` headers
    legacyHeaders: false,
};

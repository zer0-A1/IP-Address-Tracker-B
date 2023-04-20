// middleware options

// cors
export const corsOptions = {
  origin: "https://rashidshamloo.github.io",
  optionsSuccessStatus: 200,
};

// rate-limit
export const rateLimitOptions = {
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
export const rateLimitOptionsList = {
  // time window in ms: 1 day
  windowMs: 24 * 60 * 60 * 1000,
  // max requests per IP per window
  max: 1000,
  // enable `RateLimit-` headers
  standardHeaders: true,
  // disable `X-RateLimit-` headers
  legacyHeaders: false,
};

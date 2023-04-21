import { IRateLimiterOptions } from "rate-limiter-flexible";
import { CorsOptions } from "cors";

// middleware options

// cors
export const corsOptions: CorsOptions = {
  origin: "https://rashidshamloo.github.io",
  methods: "GET",
  optionsSuccessStatus: 200,
};

// rate-limit
export const rateLimitFlexibleOptions: IRateLimiterOptions = {
  points: 100,
  // Per day
  duration: 24 * 60 * 60,
};

// rate-limit for api list
export const rateLimitFlexibleOptionsList: IRateLimiterOptions = {
  points: 1000,
  // Per day
  duration: 24 * 60 * 60,
};

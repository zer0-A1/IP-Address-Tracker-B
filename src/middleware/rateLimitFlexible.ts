// express
import { Request, Response, NextFunction } from "express";

// rate-limit-flexible
import { RateLimiterMemory, IRateLimiterOptions } from "rate-limiter-flexible";

// custom middleware wrapper for rate limiter flexible
const rateLimitFlexible = (options: IRateLimiterOptions = {}) => {
  const rateLimiter = new RateLimiterMemory(options);
  const myRateLimiter = (req: Request, res: Response, next: NextFunction) => {
    // rate-limit-flexible
    const requestIP = req.headers["x-forwarded-for"];
    rateLimiter
      .consume(requestIP as string, 1)
      .then((rateLimiterRes) => {
        const headers = {
          "Retry-After": Math.trunc(rateLimiterRes.msBeforeNext / 1000),
          "X-RateLimit-Limit": options.points,
          "X-RateLimit-Remaining": rateLimiterRes.remainingPoints,
          "X-RateLimit-Reset": new Date(
            Date.now() + rateLimiterRes.msBeforeNext
          ),
        };
        res.set(headers);
        next();
      })
      .catch((rateLimiterRes) => {
        const headers = {
          "Retry-After": Math.trunc(rateLimiterRes.msBeforeNext / 1000),
          "X-RateLimit-Limit": options.points,
          "X-RateLimit-Remaining": rateLimiterRes.remainingPoints,
          "X-RateLimit-Reset": new Date(
            Date.now() + rateLimiterRes.msBeforeNext
          ),
        };
        res.set(headers);
        return res.status(400).json({
          status: "fail",
          message:
            "you have reached your request limit for today. please try again later.",
        });
      });
  };
  return myRateLimiter;
};

export default rateLimitFlexible;

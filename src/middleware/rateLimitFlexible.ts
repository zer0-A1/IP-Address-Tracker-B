// express
import { Request, Response, NextFunction } from 'express';

// rate-limit-flexible
import {
  RateLimiterMemory,
  IRateLimiterOptions,
  RateLimiterRes,
} from 'rate-limiter-flexible';

// utility
import { validateIp } from '../utility/utility';

// custom middleware wrapper for rate limiter flexible
const rateLimitFlexible = (options: IRateLimiterOptions = {}) => {
  const rateLimiter = new RateLimiterMemory(options);
  const myRateLimiter = (req: Request, res: Response, next: NextFunction) => {
    // rate-limit-flexible
    const requestIP = req.headers['x-forwarded-for']?.toString();
    // if can't get ip, or it's not valid, do nothing
    if (!requestIP || !validateIp(requestIP)) next();
    else {
      rateLimiter
        .consume(requestIP, 1)
        .then((rateLimiterRes) => {
          //set headers
          res.set(getLimiterHeaders(options, rateLimiterRes));
          next();
        })
        .catch((rateLimiterRes) => {
          //set headers
          res.set(getLimiterHeaders(options, rateLimiterRes));
          return res.status(400).json({
            status: 'fail',
            message:
              'you have reached your request limit for today. please try again later.',
          });
        });
    }
  };
  return myRateLimiter;
};

// get headers based on rateLimiterRes and options
const getLimiterHeaders = (
  options: IRateLimiterOptions,
  rateLimiterRes: RateLimiterRes
) => {
  return {
    'Retry-After': Math.trunc(rateLimiterRes.msBeforeNext / 1000),
    'X-RateLimit-Limit': options.points,
    'X-RateLimit-Remaining': rateLimiterRes.remainingPoints,
    'X-RateLimit-Reset': new Date(Date.now() + rateLimiterRes.msBeforeNext),
  };
};

export default rateLimitFlexible;

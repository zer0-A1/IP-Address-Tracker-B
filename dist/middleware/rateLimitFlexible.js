"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// rate-limit-flexible
var rate_limiter_flexible_1 = require("rate-limiter-flexible");
// custom middleware wrapper for rate limiter flexible
var rateLimitFlexible = function (options) {
    if (options === void 0) { options = {}; }
    var rateLimiter = new rate_limiter_flexible_1.RateLimiterMemory(options);
    var myRateLimiter = function (req, res, next) {
        // rate-limit-flexible
        var requestIP = req.headers["x-forwarded-for"];
        rateLimiter
            .consume(requestIP, 1)
            .then(function (rateLimiterRes) {
            var headers = {
                "Retry-After": Math.trunc(rateLimiterRes.msBeforeNext / 1000),
                "X-RateLimit-Limit": options.points,
                "X-RateLimit-Remaining": rateLimiterRes.remainingPoints,
                "X-RateLimit-Reset": new Date(Date.now() + rateLimiterRes.msBeforeNext),
            };
            res.set(headers);
            next();
        })
            .catch(function (rateLimiterRes) {
            var headers = {
                "Retry-After": Math.trunc(rateLimiterRes.msBeforeNext / 1000),
                "X-RateLimit-Limit": options.points,
                "X-RateLimit-Remaining": rateLimiterRes.remainingPoints,
                "X-RateLimit-Reset": new Date(Date.now() + rateLimiterRes.msBeforeNext),
            };
            res.set(headers);
            return res.status(400).json({
                status: "fail",
                message: "you have reached your request limit for today. please try again later.",
            });
        });
    };
    return myRateLimiter;
};
exports.default = rateLimitFlexible;

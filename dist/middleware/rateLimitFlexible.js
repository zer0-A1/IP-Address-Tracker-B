"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// rate-limit-flexible
var rate_limiter_flexible_1 = require("rate-limiter-flexible");
// utility
var utility_1 = require("../utility/utility");
// custom middleware wrapper for rate limiter flexible
var rateLimitFlexible = function (options) {
    if (options === void 0) { options = {}; }
    var rateLimiter = new rate_limiter_flexible_1.RateLimiterMemory(options);
    var myRateLimiter = function (req, res, next) {
        var _a;
        // rate-limit-flexible
        var requestIP = (_a = req.headers['x-forwarded-for']) === null || _a === void 0 ? void 0 : _a.toString();
        // if can't get ip, or it's not valid, do nothing
        if (!requestIP || !(0, utility_1.validateIp)(requestIP))
            next();
        else {
            rateLimiter
                .consume(requestIP, 1)
                .then(function (rateLimiterRes) {
                //set headers
                res.set(getLimiterHeaders(options, rateLimiterRes));
                next();
            })
                .catch(function (rateLimiterRes) {
                //set headers
                res.set(getLimiterHeaders(options, rateLimiterRes));
                return res.status(400).json({
                    status: 'fail',
                    message: 'you have reached your request limit for today. please try again later.',
                });
            });
        }
    };
    return myRateLimiter;
};
// get headers based on rateLimiterRes and options
var getLimiterHeaders = function (options, rateLimiterRes) {
    return {
        'Retry-After': Math.trunc(rateLimiterRes.msBeforeNext / 1000),
        'X-RateLimit-Limit': options.points,
        'X-RateLimit-Remaining': rateLimiterRes.remainingPoints,
        'X-RateLimit-Reset': new Date(Date.now() + rateLimiterRes.msBeforeNext),
    };
};
exports.default = rateLimitFlexible;

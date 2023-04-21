"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// a little middleware to add 'X-Powered-By' header
var poweredBy = function (_, res, next) {
    res.setHeader("X-Powered-By", "Node.js, Express.js, Vercel.com, a cup of coffee, and lots of love :)");
    next();
};
exports.default = poweredBy;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimitFlexibleOptionsList = exports.rateLimitFlexibleOptions = exports.corsOptions = void 0;
// middleware options
// cors
exports.corsOptions = {
    origin: 'https://zer0-a1.github.io',
    methods: 'GET',
    optionsSuccessStatus: 200,
};
// rate-limit
exports.rateLimitFlexibleOptions = {
    points: 100,
    // Per day
    duration: 24 * 60 * 60,
};
// rate-limit for api list
exports.rateLimitFlexibleOptionsList = {
    points: 1000,
    // Per day
    duration: 24 * 60 * 60,
};

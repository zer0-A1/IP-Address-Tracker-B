"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// dotenv
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// my custom middleware for checking the token
// (token is just a pre-generated string and works like API Keys)
var checkToken = function (req, res, next) {
    if (!req.query.token || req.query.token !== process.env.TOKEN)
        return res.status(403).json({
            status: "fail",
            message: "access forbidden",
        });
    else
        next();
};
exports.default = checkToken;

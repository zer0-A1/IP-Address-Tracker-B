"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.API_URL = exports.API_PROVIDER = exports.API_KEYS = void 0;
// dotenv
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// API variables
// API KEY
exports.API_KEYS = {
    ipify: process.env.API_KEY_IPIFY,
    ipgeolocation: process.env.API_KEY_IPGEOLOCATION,
    ip2location: process.env.API_KEY_IP2LOCATION,
    ipdata: process.env.API_KEY_IPDATA,
};
// API PROVIDER
exports.API_PROVIDER = {
    "ip-api": "http://ip-api.com",
    ipify: "https://www.ipify.org",
    ipgeolocation: "https://ipgeolocation.io",
    ipwho: "https://ipwho.is",
    ip2location: "https://www.ip2location.io/",
    ipdata: "https://ipdata.co",
};
// API URL
exports.API_URL = {
    "ip-api": "http://ip-api.com/json/",
    ipify: "https://geo.ipify.org/api/v2/country,city?apiKey=" +
        exports.API_KEYS["ipify"] +
        "&ipAddress=",
    ipgeolocation: "https://api.ipgeolocation.io/ipgeo?apiKey=" +
        exports.API_KEYS["ipgeolocation"] +
        "&ip=",
    ipwho: "https://ipwho.is/",
    ip2location: "https://api.ip2location.io/?key=" +
        exports.API_KEYS["ip2location"] +
        "&format=json&ip=",
    ipdata: "https://api.ipdata.co/query/?api-key=" + exports.API_KEYS["ipdata"],
};

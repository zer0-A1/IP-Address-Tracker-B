"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// express
var express_1 = __importDefault(require("express"));
// middleware
// cors
var cors_1 = __importDefault(require("cors"));
// rate-limit-flexible
var rateLimitFlexible_1 = __importDefault(require("./middleware/rateLimitFlexible"));
// my custom middleware to add {author: "github.com/rashidshamloo"} and timestamp to all json responses
var addToJson_1 = __importDefault(require("./middleware/addToJson"));
var fieldsToAdd = {
    author: "github.com/rashidshamloo",
    date: function () { return new Date().toJSON(); },
};
// my custom middleware for checking the token
var checkToken_1 = __importDefault(require("./middleware/checkToken"));
// my custom middleware to add 'X-Powered-By' header
var poweredBy_1 = __importDefault(require("./middleware/poweredBy"));
// configs
var middleware_1 = require("./config/middleware");
// API data
var api_1 = require("./config/api");
// utility
var utility_1 = require("./utility/utility");
// initialization
var app = (0, express_1.default)();
var port = process.env.PORT || 443;
/*
  the reason i've not added these middlewares to the app globally
  is because i want the rate limit headers to be present on all responses
  and since i'm using different rate-limit options for "/" and "/list" handlers
  i can't add it to the app globally. so for these middleware to be in the chain
  after the rateLimitFlexible, i'v added them to the handler instead.

app.use(cors(corsOptions));
app.use(checkToken);
*/
app.use(poweredBy_1.default);
app.use((0, addToJson_1.default)(fieldsToAdd));
// return ip info for selected api and
// provided ip or domain or
// request ip if none of them are provided
app.post("/", (0, rateLimitFlexible_1.default)(middleware_1.rateLimitFlexibleOptions), (0, cors_1.default)(middleware_1.corsOptions), checkToken_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var ip, error_1, data, error_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                // alternate to using cors() middleware
                //   res.setHeader(
                //     "Access-Control-Allow-Origin",
                //     "https://rashidshamloo.github.io"
                //   );
                // if api doesn't exist return error
                if (!req.body.api || !api_1.API_URL[req.body.api]) {
                    return [2 /*return*/, res.status(400).json({ status: "fail", message: "bad request" })];
                }
                if (!(!req.body.ip && !req.body.domain)) return [3 /*break*/, 1];
                // get ip from "x-forwarded-for" header on vercel
                // and return error if can't get it
                if (!(ip = (_a = req.headers["x-forwarded-for"]) === null || _a === void 0 ? void 0 : _a.toString()))
                    return [2 /*return*/, res.status(400).json({
                            status: "fail",
                            message: "no ip is provided and can't get request ip.",
                        })];
                return [3 /*break*/, 6];
            case 1:
                if (!req.body.ip) return [3 /*break*/, 2];
                ip = req.body.ip.toString();
                return [3 /*break*/, 6];
            case 2:
                if (!req.body.domain) return [3 /*break*/, 6];
                _b.label = 3;
            case 3:
                _b.trys.push([3, 5, , 6]);
                return [4 /*yield*/, (0, utility_1.fetchIp)(req.body.domain.toString())];
            case 4:
                ip = _b.sent();
                return [3 /*break*/, 6];
            case 5:
                error_1 = _b.sent();
                return [2 /*return*/, res
                        .status(error_1.status || 500)
                        .json({ status: "fail", message: error_1.message })];
            case 6:
                // validate the ip and return error if it fails
                if (!(0, utility_1.validateIp)(ip))
                    return [2 /*return*/, res
                            .status(400)
                            .json({ status: "fail", message: "wrong IP address" })];
                _b.label = 7;
            case 7:
                _b.trys.push([7, 9, , 10]);
                return [4 /*yield*/, (0, utility_1.fetchDataFromApi)(res, ip, req.body.api.toString())];
            case 8:
                data = _b.sent();
                return [3 /*break*/, 10];
            case 9:
                error_2 = _b.sent();
                // return error message and if the error was because of time out,
                // show a better message instead of just "aborted"
                return [2 /*return*/, res.status(error_2.status || 500).json({
                        status: "fail",
                        message: error_2.name === "AbortError"
                            ? "selected api took too long to respond."
                            : error_2.message,
                    })];
            case 10: 
            // return json of the formatted data
            return [2 /*return*/, res.json((0, utility_1.getIpInfoFromApiRes)(res, data, req.body.api.toString()))];
        }
    });
}); });
// show webpage on get request
app.get("/", function (req, res) {
    res.redirect("http://rashidshamloo.github.io/fem_033_ip-address-tracker");
});
// return api list
// higher rate limit because we're not calling any external APIs
app.all("/list", (0, rateLimitFlexible_1.default)(middleware_1.rateLimitFlexibleOptionsList), (0, cors_1.default)(middleware_1.corsOptions), checkToken_1.default, function (_, res) {
    var apiList = Object.keys(api_1.API_PROVIDER).map(function (api) {
        return { name: api, domain: (0, utility_1.getDomainFromUrl)(api_1.API_PROVIDER[api]) };
    });
    return res.json(apiList);
});
app.listen(port, function () {
    console.log("\uD83C\uDF89 Server is running at port: ".concat(port));
});
exports.default = app;

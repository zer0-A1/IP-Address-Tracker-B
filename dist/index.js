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
// cors
var cors_1 = __importDefault(require("cors"));
// rate-limit
var express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// configs
var middleware_1 = require("./config/middleware");
var api_1 = require("./config/api");
// utility
var utility_1 = require("./utility/utility");
// initialization
var app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, express_rate_limit_1.default)());
var port = process.env.PORT || 443;
app.get("/", (0, cors_1.default)(middleware_1.corsOptions), (0, express_rate_limit_1.default)(middleware_1.rateLimitOptions), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, data, ip, ipInfo;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // alternate to using cors() middleware
                //   res.setHeader(
                //     "Access-Control-Allow-Origin",
                //     "https://rashidshamloo.github.io"
                //   );
                // if api doesn't exist return error
                if (!req.query.api || !api_1.API_URL[req.query.api]) {
                    return [2 /*return*/, res.status(400).json({ status: "fail", message: "bad request" })];
                }
                if (!(!req.query.ip && !req.query.domain)) return [3 /*break*/, 2];
                return [4 /*yield*/, (0, utility_1.fetchDataFromApi)(res, 
                    // requestIP as string,
                    "140.238.1.117", req.query.api)];
            case 1:
                data = _a.sent();
                if (data)
                    return [2 /*return*/, res.json((0, utility_1.getIpInfoFromApiRes)(res, data, req.query.api))];
                return [3 /*break*/, 8];
            case 2:
                if (!req.query.ip) return [3 /*break*/, 4];
                // if ip is not valid return error
                if (!(0, utility_1.validateIp)(req.query.ip))
                    return [2 /*return*/, res
                            .status(400)
                            .json({ status: "fail", message: "wrong IP address" })];
                return [4 /*yield*/, (0, utility_1.fetchDataFromApi)(res, req.query.ip, req.query.api)];
            case 3:
                data = _a.sent();
                return [2 /*return*/, res.json((0, utility_1.getIpInfoFromApiRes)(res, data, req.query.api))];
            case 4:
                if (!req.query.domain) return [3 /*break*/, 7];
                return [4 /*yield*/, (0, utility_1.fetchIp)(res, req.query.domain)];
            case 5:
                ip = _a.sent();
                // if ip is not valid return error
                if (!(0, utility_1.validateIp)(ip))
                    return [2 /*return*/, res
                            .status(400)
                            .json({ status: "fail", message: "wrong IP address" })];
                return [4 /*yield*/, (0, utility_1.fetchDataFromApi)(res, ip, req.query.api)];
            case 6:
                ipInfo = _a.sent();
                return [2 /*return*/, res.json(ipInfo)];
            case 7: return [2 /*return*/, res.status(400).json({ status: "fail", message: "bad request" })];
            case 8: return [2 /*return*/];
        }
    });
}); });
app.listen(port, function () {
    console.log("\uD83C\uDF89 Server is running at port: ".concat(port));
});
exports.default = app;

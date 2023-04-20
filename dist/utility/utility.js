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
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateIp = exports.fetchIp = exports.getIpInfoFromApiRes = exports.fetchDataFromApi = void 0;
// API config
var api_1 = require("../config/api");
// functions
// fetch data from API url
var fetchDataFromApi = function (res, ipAddress, api) { return __awaiter(void 0, void 0, void 0, function () {
    var url, fetchRes, data, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = "";
                if (api === "ipdata")
                    url = api_1.API_URL[api].replace("query", ipAddress);
                else
                    url = api_1.API_URL[api] + ipAddress;
                console.log(url);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, fetch(url)];
            case 2:
                fetchRes = _a.sent();
                if (!fetchRes.ok)
                    return [2 /*return*/, res
                            .status(fetchRes.status)
                            .json({ status: "fail", message: fetchRes.statusText })];
                return [4 /*yield*/, fetchRes.json()];
            case 3:
                data = _a.sent();
                if (isValidApiResponse(api, data))
                    return [2 /*return*/, data];
                else
                    res.status(500).json({
                        status: "fail",
                        message: "selected api is not working. it may be down or may have reached the max request limit.",
                    });
                return [3 /*break*/, 5];
            case 4:
                error_1 = _a.sent();
                res.status(500).json({ status: "fail", message: error_1.message });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.fetchDataFromApi = fetchDataFromApi;
// convert API data to the desired ipInfo format
var getIpInfoFromApiRes = function (res, resJson, api) {
    var _a = Array(4).fill(""), ip = _a[0], isp = _a[1], location = _a[2], timezone = _a[3];
    var _b = Array(2).fill(0), lat = _b[0], lng = _b[1];
    switch (api) {
        case "ip-api":
            ip = resJson.query;
            isp = resJson.isp;
            location = "".concat(resJson.country, ", ").concat(resJson.regionName, ", ").concat(resJson.city, " ").concat(resJson.zip);
            timezone = resJson.timezone;
            lat = Number(resJson.lat);
            lng = Number(resJson.lon);
            break;
        case "ipgeolocation":
            ip = resJson.ip;
            isp = resJson.isp;
            location = "".concat(resJson.country_code2, ", ").concat(resJson.state_prov, ", ").concat(resJson.city, " ").concat(resJson.zipcode);
            timezone =
                resJson.time_zone.name +
                    "\n" +
                    "UTC" +
                    (resJson.time_zone.offset > 0 && "+") +
                    resJson.time_zone.offset;
            lat = Number(resJson.latitude);
            lng = Number(resJson.longitude);
            break;
        case "ipwho":
            ip = resJson.ip;
            isp = resJson.connection.isp;
            location = "".concat(resJson.country_code, ", ").concat(resJson.region, ", ").concat(resJson.city, " ").concat(resJson.postal);
            timezone = resJson.timezone.id + "\nUTC" + resJson.timezone.utc;
            lat = Number(resJson.latitude);
            lng = Number(resJson.longitude);
            break;
        case "ip2location":
            ip = resJson.ip;
            isp = resJson.as;
            location = "".concat(resJson.country_code, ", ").concat(resJson.region_name, ", ").concat(resJson.city_name, " ").concat(resJson.zip_code);
            timezone = "UTC" + resJson.time_zone;
            lat = Number(resJson.latitude);
            lng = Number(resJson.longitude);
            break;
        case "ipdata":
            ip = resJson.ip;
            isp = resJson.asn.name;
            location = "".concat(resJson.country_code, ", ").concat(resJson.region, ", ").concat(resJson.city, " ").concat(resJson.postal);
            timezone = resJson.time_zone.name + "\nUTC" + resJson.time_zone.offset;
            lat = Number(resJson.latitude);
            lng = Number(resJson.longitude);
            break;
        default:
            return res
                .status(500)
                .json({ status: "fail", message: "no API provided" });
    }
    var ipinfo = {
        ip: ip,
        isp: isp,
        location: location,
        timezone: timezone,
        lat: lat,
        lng: lng,
        provider: api_1.API_PROVIDER[api],
        author: "https://github.com/rashidshamloo",
    };
    return ipinfo;
};
exports.getIpInfoFromApiRes = getIpInfoFromApiRes;
// fetch IP of domain
var fetchIp = function (res, domain) { return __awaiter(void 0, void 0, void 0, function () {
    var url, fetchRes, jsonData, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = "https://api.ipify.org/?format=json&domain=" + domain;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, fetch(url)];
            case 2:
                fetchRes = _a.sent();
                if (!fetchRes.ok)
                    return [2 /*return*/, res
                            .status(fetchRes.status)
                            .json({ status: "fail", message: fetchRes.statusText })];
                return [4 /*yield*/, fetchRes.json()];
            case 3:
                jsonData = _a.sent();
                return [2 /*return*/, jsonData.query];
            case 4:
                error_2 = _a.sent();
                return [2 /*return*/, res.status(500).json({ status: "fail", message: error_2.message })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.fetchIp = fetchIp;
// validate IP address
// regex from "https://uibakery.io/regex-library/ip-address"
var ipv4Regex = /^(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
var ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
var validateIp = function (ip) {
    return ipv4Regex.test(ip) || ipv6Regex.test(ip);
};
exports.validateIp = validateIp;
// validate api response
var isValidApiResponse = function (api, data) {
    if (!data)
        return false;
    var isValid = false;
    switch (api) {
        case "ip-api":
            if (data.query)
                isValid = true;
            break;
        case "ipgeolocation":
        case "ipwho":
        case "ip2location":
        case "ipdata":
        default:
            if (data.ip)
                isValid = true;
            break;
    }
    return isValid;
};

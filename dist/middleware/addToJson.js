"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// my custom middleware to add extra fields to json response
var addToJson = function (fieldsToAdd) {
    if (fieldsToAdd === void 0) { fieldsToAdd = {}; }
    var myMiddleWare = function (_, res, next) {
        res.json = function (object) {
            var returnArray = Object.keys(fieldsToAdd).map(function (key) {
                return [
                    key,
                    fieldsToAdd[key] instanceof Function
                        ? fieldsToAdd[key]()
                        : fieldsToAdd[key],
                ];
            });
            var returnObject = Object.fromEntries(returnArray);
            return res
                .setHeader("Content-Type", "application/json")
                .send(JSON.stringify(Object.assign(object, returnObject)));
        };
        next();
    };
    return myMiddleWare;
};
exports.default = addToJson;

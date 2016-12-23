const apiVersion = "1.0.0";
var Router = require("restify-router").Router;
var AccountManager = require("sinau-modules").managers.auth.AccountManager;
var db = require("../../db");
var resultFormatter = require("../../result-formatter");

var passport = require("../../passports/jwt-passport");

function getRouter() {
    var router = new Router();
    router.get("/", passport, (request, response, next) => {
        var user = request.user;
        var result = resultFormatter.ok(apiVersion, 200, user);
        response.send(200, result);
    });
    return router;
}


module.exports = getRouter;

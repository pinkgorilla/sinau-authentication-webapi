const apiVersion = "1.0.0";
var Router = require("restify-router").Router;

var resultFormatter = require("../../result-formatter");
var passport = require("../../passports/local-passport"); 
var authUtils = require("../../auth-utils");

function getRouter() {
    var router = new Router();

    router.post("/", passport, (request, response, next) => {
        var account = request.user;
        var token = authUtils.createJWT(account);

        var result = resultFormatter.ok(apiVersion, 200, token);
        response.send(200, result);
    });
    return router;
}
module.exports = getRouter;

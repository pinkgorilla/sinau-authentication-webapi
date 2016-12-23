const apiVersion = "1.0.0";
var RoleManager = require("sinau-modules").managers.auth.AccountManager;
var getJWTRouter = require("../jwt-router-factory");

function getRouter() {
    return getJWTRouter(RoleManager, apiVersion);
}
module.exports = getRouter;

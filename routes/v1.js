var facebookAuthRouter = require("../src/routers/facebook-auth-router");
var accountRouter = require("../src/routers/v1/account-router");
var roleRouter = require("../src/routers/v1/role-router");
var meRouter = require("../src/routers/v1/me-router");
var authRouter = require("../src/routers/v1/authenticate-router");

module.exports = function(server) {

    authRouter().applyRoutes(server, "/v1/authenticate");

    facebookAuthRouter().applyRoutes(server, "/facebook");

    accountRouter().applyRoutes(server, "/v1/accounts");

    roleRouter().applyRoutes(server, "/v1/roles");

    meRouter().applyRoutes(server, "/v1/me");
};

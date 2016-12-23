var facebookAuthRouter = require("../src/routers/facebook-auth-router");
var accountRouter = require("../src/routers/v1/account-router");
var roleRouter = require("../src/routers/v1/role-router");
var meRouter = require("../src/routers/v1/me-router");
var authRouter = require("../src/routers/v1/authenticate-router");

module.exports = function(server) {

    authRouter().applyRoutes(server, "/authenticate");

    facebookAuthRouter().applyRoutes(server, "/facebook");

    accountRouter().applyRoutes(server, "/accounts");

    roleRouter().applyRoutes(server, "/roles");

    meRouter().applyRoutes(server, "/me");
};

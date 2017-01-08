var accountRouter = require("../src/routers/v1/account-router");
var roleRouter = require("../src/routers/v1/role-router");
var meRouter = require("../src/routers/v1/me-router");
var authRouter = require("../src/routers/v1/authenticate-router");
var authFacebookRouter = require("../src/routers/v1/authenticate-facebook");
var authGoogleRouter = require("../src/routers/v1/authenticate-google");

module.exports = function (server) {
    authFacebookRouter().applyRoutes(server, "/authenticate/facebook");
    authGoogleRouter().applyRoutes(server, "/authenticate/google");

    authRouter().applyRoutes(server, "/authenticate");

    accountRouter().applyRoutes(server, "/accounts");

    roleRouter().applyRoutes(server, "/roles");

    meRouter().applyRoutes(server, "/me");
};

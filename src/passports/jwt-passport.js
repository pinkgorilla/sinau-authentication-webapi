var AccountManager = require("sinau-modules").managers.auth.AccountManager;
var db = require("../db");
var passport = require("passport");
var config = require("../../config");

var JwtStrategy = require("passport-jwt").Strategy;
var JwtExtract = require("passport-jwt").ExtractJwt;

var options = {};
options.jwtFromRequest = JwtExtract.fromAuthHeader();
options.secretOrKey = config.TOKEN_SECRET;

passport.use(new JwtStrategy(options,
    function (jwtPayload, done) {
        db.get()
            .then((db) => {
                var manager = new AccountManager(db, {
                    username: "auth-server"
                });
                return Promise.resolve(manager);
            })
            .then((manager) => {
                manager.getSingleById(jwtPayload.sub)
                    .then((_account) => {

                        return done(null, _account);
                    });
            })
            .catch((e) => {
                return done(e, null);
            })
    }
));

module.exports = passport.authenticate("jwt", {
    session: false
});
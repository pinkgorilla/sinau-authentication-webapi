var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var AuthManager = require("sinau-modules").managers.auth.AuthManager;
var db = require("../db");

passport.use(new LocalStrategy(function(username, password, done) {
    db.get()
        .then((db) => {
            var manager = new AuthManager(db, {
                username: "auth-server"
            });
            return manager.authenticate(username, password);
        })
        .then((account) => {
            return done(null, account);
        })
        .catch((e) => {
            done(e);
        });
}));

module.exports = passport.authenticate("local", {
    session: false
});

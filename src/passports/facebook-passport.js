var passport = require("passport");
var FacebookStrategy = require("passport-facebook").Strategy;
var AccountManager = require("sinau-modules").managers.auth.AccountManager;
var db = require("../db");

var appId = "1720943651560993";
var appSecret = "a14cd18eedcdbe68ff8173465f6a9f04";
var host = "https://sinau-auth-api-pinkgorilla.c9users.io"; // `${process.env.IP}:${process.env.PORT}`
console.log(`${host}/facebook/callback`);

passport.use(new FacebookStrategy({
        clientID: appId,
        clientSecret: appSecret,
        callbackURL: `${host}/facebook/callback`,
        // passReqToCallback: true,
        enableProof: true,
        profileFields: ["name", "gender", "email", "birthday"]
    },
    function(accessToken, refreshToken, fbProfile, cb) {
        db.get()
            .then((db) => {
                var manager = new AccountManager(db, {
                    username: "facebook-passport"
                });

                var query = {
                    "facebook.id": fbProfile.id
                };

                manager.getSingleByQueryOrDefault(query)
                    .then((account) => {
                        if (account) {
                            return cb(null, account);
                        }
                        else {
                            var email = ((fbProfile.emails || [])[0] || {
                                value: ""
                            }).value;

                            manager.checkEmailIsUsed(email)
                                .then(emailIsUsed => {

                                    var newAccount = {
                                        username: emailIsUsed ? fbProfile.id : email,
                                        password: fbProfile.id,
                                        email: email,
                                        isLocked: false,

                                        profile: {
                                            firstname: fbProfile.name.givenName || "",
                                            lastname: fbProfile.name.familyName || "",
                                            gender: fbProfile.gender || "male",
                                            dob: new Date(),
                                            email: email
                                        },

                                        facebook: {
                                            id: fbProfile.id,
                                            accessToken: accessToken,
                                            refreshToken: refreshToken
                                        },
                                        roles: ["user"]
                                    };

                                    manager.create(newAccount)
                                        .then((id) => {
                                            newAccount._id = id;
                                            return cb(null, newAccount);
                                        })
                                        .catch((e) => {
                                            return cb(e, null);
                                        });
                                });
                        }
                    })
                    .catch((e) => {
                        return cb(e, null);
                    });
            })
            .catch((e) => {
                return cb(e, null);
            });
    }));

module.exports = passport.authenticate("facebook", {
    session: false,
    scope: ["public_profile", "email", "user_friends"]
});

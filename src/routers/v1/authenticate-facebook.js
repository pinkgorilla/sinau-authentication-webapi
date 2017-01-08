const apiVersion = "1.0.0";
var Router = require("restify-router").Router;
var Account = require("sinau-models").auth.Account;
var Profile = require("sinau-models").auth.Profile;
var AccountManager = require("sinau-modules").managers.auth.AccountManager;

var db = require("../../db");
var resultFormatter = require("../../result-formatter");
var config = require("../../../config")
var authUtils = require("../../auth-utils");
var _request = require("request");

function exchangeAccessToken(params) {
    var accessTokenUrl = 'https://graph.facebook.com/v2.3/oauth/access_token';
    return new Promise((resolve, reject) => {
        _request.get({ url: accessTokenUrl, qs: params, json: true }, function (err, response, accessToken) {
            if (err)
                reject(err);
            else if (response.statusCode !== 200) {
                reject(new Error(accessToken.error.message));
            }
            else {
                resolve(accessToken);
            }
        })
    });
};

function getProfile(accessToken) {
    var graphApiUrl = 'https://graph.facebook.com/v2.3/me?fields=name,first_name,last_name,email,gender';
    return new Promise((resolve, reject) => {
        _request.get({ url: graphApiUrl, qs: accessToken, json: true }, function (err, response, profile) {
            if (err)
                reject(err);
            else if (response.statusCode !== 200) {
                reject(new Error(profile.error.message));
            }
            else {
                resolve(profile);
            }
        });
    });
}

function getAccount(request, profile) {
    return db.get()
        .then((db) => {
            var manager = new AccountManager(db, {
                username: "auth-server"
            });
            return Promise.resolve(manager);
        })
        .then((manager) => {
            return manager.getSingleByQueryOrDefault({ "facebook.id": profile.id })
                .then((account) => {
                    if (request.headers.authorization) {
                        if (account) {
                            var error = new Error('There is already a Facebook account that belongs to you');
                            error.name = "OAUTH_EXISTS_ERROR";
                            return Promise.reject(error);
                        }

                        var token = request.headers.authorization.split(' ')[1];
                        var payload = authUtils.decodeJWT(token);

                        return manager.getSingleByIdOrDefault(payload.sub)
                            .then((_account) => {
                                if (!_account) {
                                    return Promise.reject({ message: 'User not found' });
                                }

                                _account.facebook = _account.facebook || {};
                                _account.facebook.id = profile.id;
                                _account.picture = _account.picture || 'https://graph.facebook.com/v2.3/' + profile.id + '/picture?type=large';
                                _account.displayName = _account.displayName || profile.name;
                                return manager.update(_account)
                                    .then((accountId) => {
                                        return manager.getSingleById(accountId);
                                    });
                            });
                    }
                    else {
                        if (account) {
                            return Promise.resolve(account);
                        }

                        var account = new Account({
                            username: profile.email,
                            email: profile.email,
                            displayName: profile.name,
                            picture: 'https://graph.facebook.com/v2.3/' + profile.id + '/picture?type=large',
                            profile: new Profile({
                                firstname: profile.first_name,
                                lastname: profile.last_name,
                                gender: profile.gender,
                                dob: new Date(1900, 1, 1),
                                email: profile.email
                            }),
                            kind: "facebook",
                            facebook: {
                                id: profile.id
                            }
                        });

                        return manager.create(account)
                            .then((accountId) => {
                                return manager.getSingleById(accountId);
                            });
                    }
                })
        });
}

function createToken(account) {
    var token = authUtils.createJWT(account);
    return Promise.resolve(token);
};

function getRouter() {
    var router = new Router();

    router.post("/", (request, response, next) => {
        var params = {
            code: request.body.code,
            client_id: config.FACEBOOK_APP_ID,
            client_secret: config.FACEBOOK_APP_SECRET,
            redirect_uri: request.body.redirectUri
        };

        exchangeAccessToken(params)
            .then(getProfile)
            .then((fbProfile) => {
                return getAccount(request, fbProfile);
            })
            .then(createToken)
            .then((token) => {
                response.send({ token: token });
            })
            .catch((e) => {
                var error = resultFormatter.fail(apiVersion, 500, e);
                response.send(error.statusCode, error);
            })
    });
    return router;
}
module.exports = getRouter;

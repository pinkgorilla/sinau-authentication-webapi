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
    var accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
    return new Promise((resolve, reject) => {
        _request.post(accessTokenUrl, { json: true, form: params }, function (err, response, token) {
            if (err)
                reject(err);
            else {
                resolve(token.access_token);
            }
        })
    });
};

function getProfile(accessToken) {
    var peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
    var headers = { Authorization: 'Bearer ' + accessToken };
    return new Promise((resolve, reject) => {
        _request.get({ url: peopleApiUrl, headers: headers, json: true }, function (err, response, profile) {
            if (err)
                reject(err);
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
            return manager.getSingleByQueryOrDefault({ "google.id": profile.sub })
                .then((account) => {
                    if (request.headers.authorization) {
                        if (account) {
                            var error = new Error('There is already a Google account that belongs to you');
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

                                _account.google = _account.google || {};
                                _account.google.id = profile.sub;
                                _account.picture = _account.picture || profile.picture.replace('sz=50', 'sz=200');
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
                            picture: profile.picture.replace('sz=50', 'sz=200'),
                            profile: new Profile({
                                firstname: profile.given_name,
                                lastname: profile.family_name,
                                gender: profile.gender,
                                dob: new Date(1900, 1, 1),
                                email: profile.email
                            }),
                            kind: "google",
                            google: {
                                id: profile.sub
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
            client_id: request.body.clientId,//config.GOOGLE_CLIENT_ID,
            client_secret: config.GOOGLE_CLIENT_SECRET,
            redirect_uri: request.body.redirectUri,
            grant_type: 'authorization_code'
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

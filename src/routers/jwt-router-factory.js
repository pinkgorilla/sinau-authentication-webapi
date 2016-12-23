var Router = require("restify-router").Router;
var db = require("../db");
var resultFormatter = require("../result-formatter");
var passport = require("../passports/jwt-passport");

function getJWTRouter(ManagerType, version) {

    var apiVersion = version || "1.0.0";
    var getManager = (user) => {
        return db.get()
            .then((db) => {
                return Promise.resolve(new ManagerType(db, user));
            });
    };

    var router = new Router();

    router.get("/", passport, function(request, response, next) {
        var user = request.user;
        var query = request.query;

        getManager(user)
            .then((manager) => {
                return manager.read(query);
            })
            .then(docs => {
                var result = resultFormatter.ok(apiVersion, 200, docs.data);
                delete docs.data;
                result.info = docs;
                return Promise.resolve(result);
            })
            .then((result) => {
                response.send(result.statusCode, result);
            })
            .catch((e) => {
                var error = resultFormatter.fail(apiVersion, 500, e);
                response.send(error.statusCode, error);
            });
    });


    router.get("/:id", passport, (request, response, next) => {
        var user = request.user;
        var id = request.params.id;

        getManager(user)
            .then((manager) => {
                return manager.getSingleByIdOrDefault(id);
            })
            .then((doc) => {
                var result;
                if (!doc) {
                    result = resultFormatter.fail(apiVersion, 404, new Error("data not found"));
                }
                else {
                    result = resultFormatter.ok(apiVersion, 200, doc);
                }
                return Promise.resolve(result);
            })
            .then((result) => {
                response.send(result.statusCode, result);
            })
            .catch((e) => {
                var error = resultFormatter.fail(apiVersion, 500, e);
                response.send(500, error);
            });
    });

    router.post("/", passport, (request, response, next) => {
        var user = request.user;
        var data = request.body;

        getManager(user)
            .then((manager) => {
                return manager.create(data);
            })
            .then((docId) => {
                response.header("Location", `${request.url}/${docId.toString()}`);
                var result = resultFormatter.ok(apiVersion, 201);
                return Promise.resolve(result);
            })
            .then((result) => {
                response.send(result.statusCode, result);
            })
            .catch((e) => {
                var result;
                if (e.errors)
                    result = resultFormatter.fail(apiVersion, 400, e);
                else
                    result = resultFormatter.fail(apiVersion, 500, e);
                response.send(result.statusCode, result);
            });
    });

    router.put("/:id", passport, (request, response, next) => {
        var user = request.user;
        var id = request.params.id;
        var data = request.body;

        getManager(user)
            .then((manager) => {
                return manager.getSingleByIdOrDefault(id)
                    .then((doc) => {
                        var result;
                        if (!doc) {
                            result = resultFormatter.fail(apiVersion, 404, new Error("data not found"));
                            return Promise.resolve(result);
                        }
                        else {
                            return manager.update(data)
                                .then((docId) => {
                                    result = resultFormatter.ok(apiVersion, 204);
                                    return Promise.resolve(result);
                                });
                        }
                    });
            })
            .then((result) => {
                response.send(result.statusCode, result);
            })
            .catch((e) => {
                var error = resultFormatter.fail(apiVersion, 500, e);
                response.send(500, error);
            });
    });

    router.del("/:id", passport, (request, response, next) => {
        var user = request.user;
        var id = request.params.id;

        getManager(user)
            .then((manager) => {
                return manager.getSingleByIdOrDefault(id)
                    .then((doc) => {
                        var result;
                        if (!doc) {
                            result = resultFormatter.fail(apiVersion, 404, new Error("data not found"));
                            return Promise.resolve(result);
                        }
                        else {
                            return manager.delete(doc)
                                .then((docId) => {
                                    result = resultFormatter.ok(apiVersion, 204);
                                    return Promise.resolve(result);
                                });
                        }
                    });
            })
            .then((result) => {
                response.send(result.statusCode, result);
            })
            .catch((e) => {
                var error = resultFormatter.fail(apiVersion, 500, e);
                response.send(500, error);
            });
    });

    return router;
}
module.exports = getJWTRouter;

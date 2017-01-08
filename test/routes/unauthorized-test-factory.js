require("should");
var config = require("../../config");
const host = `${config.ip}:${config.port}`;
var Request = require("supertest");
var ObjectId = require("mongodb").ObjectId;

function getUnauthorizedTest(opt) {

    var options = opt || {};
    var uri = options.uri;

    var request = Request(host);

    it(`#01. get list without security token - [GET]${uri}`, function(done) {
        request
            .get(uri)
            .set("Accept", "application/json")
            .expect(401)
            .end(function(err, response) {
                if (err)
                    done(err);
                else {
                    done();
                }
            });
    });

    it(`#02. get data without security token - [GET]${uri}/:id`, function(done) {
        request
            .get(`${uri}/${new ObjectId()}`)
            .set("Accept", "application/json")
            .expect(401)
            .end(function(err, response) {
                if (err)
                    done(err);
                else {
                    done();
                }
            });
    });

    it(`#03. create data without security token - [GET]${uri}`, function(done) {
        request
            .post(uri)
            .set("Accept", "application/json")
            .send({})
            .expect(401)
            .end(function(err, response) {
                if (err)
                    done(err);
                else {
                    done();
                }
            });
    });


    it(`#04. update data without security token - [GET]${uri}/:id`, function(done) {
        request
            .put(`${uri}/${new ObjectId()}`)
            .set("Accept", "application/json")
            .send({})
            .expect(401)
            .end(function(err, response) {
                if (err)
                    done(err);
                else {
                    done();
                }
            });
    });


    it(`#05. delete data without security token - [GET]${uri}/:id`, function(done) {
        request
            .delete(`${uri}/${new ObjectId()}`)
            .set("Accept", "application/json")
            .expect(401)
            .end(function(err, response) {
                if (err)
                    done(err);
                else {
                    done();
                }
            });
    });

}


module.exports = getUnauthorizedTest;

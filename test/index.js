function test(name, path) {
    describe(name, function() {
        require(path);
    });
}

before("initialize server", function(done) {
    var server = require("../server");
    server()
        .then((server) => {
            var Account = require("sinau-modules").test.data.auth.account;
            Account.getTestData()
                .then((account) => {
                    done();
                })
        })
        .catch((e) => {
            done(e);
        });
});


describe("@sinau-auth-webapi", function() {
    this.timeout(2 * 60000);

    test("~/auth", "./routes/auth");
    test("~/accounts", "./routes/account");
    test("~/roles", "./routes/role");
    test("~/me", "./routes/me");
});

 var basicTest = require("../basic-test-factory");

 basicTest({
     uri: "/accounts",
     model: require("sinau-models").auth.Account,
     validate: require("sinau-models").validator.auth.account,
     util: require("sinau-modules").test.data.auth.account,
     keyword: "username"
 });
 
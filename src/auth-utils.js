'use strict';
var moment = require('moment');
var jwt = require('jwt-simple');
var config = require('../config');

exports.createJWT = function (account) {
    var payload = {
        sub: account._id,
        profile: account.profile,
        roles: account.roles,
        iat: moment().unix(),
        exp: moment().add(14, 'days').unix()
    };
    return jwt.encode(payload, config.TOKEN_SECRET);
}

exports.decodeJWT = function (token) {
    var payload = jwt.decode(token, config.TOKEN_SECRET);
    return payload;
};

// exports.handleError = function (res, err) {
//     return res.send(400, err);
// }


// exports.ensureAuthenticated = function(req, res, next) {
//   if (!req.headers.authorization) {
//     return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
//   }
//   var token = req.headers.authorization.split(' ')[1];

//   var payload = null;
//   try {
//     payload = jwt.decode(token, config.TOKEN_SECRET);
//   }
//   catch (err) {
//     return res.status(401).send({ message: err.message });
//   }

//   if (payload.exp <= moment().unix()) {
//     return res.status(401).send({ message: 'Token has expired' });
//   }
//   req.user = payload.sub;
//   next();
// }
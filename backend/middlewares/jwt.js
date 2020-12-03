var jwtToken = require('jsonwebtoken');

function jwt() {
  return function (req, res, next) {
    if (req.cookies.jwt) {
      jwtToken.verify(req.cookies.jwt, process.env.JWT_SECRET, function(err, decoded) {
        if (err) {
          req.passwords = [];
        } else {
          req.passwords = (decoded && decoded.passwords) || [];
        }
        next();
      });
    } else {
      req.passwords = [];
      next();
    }
  }
}

module.exports = jwt;
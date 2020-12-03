var express = require('express');
var router = express.Router();
var randomize = require('randomatic');
var jwtToken = require('jsonwebtoken');

/*
  a: Lowercase alpha characters (abcdefghijklmnopqrstuvwxyz')
  A: Uppercase alpha characters (ABCDEFGHIJKLMNOPQRSTUVWXYZ')
  0: Numeric characters (0123456789')
  !: Special characters (~!@#$%^&()_+-={}[];\',.)
*/
const patterns = {
  lower: 'a',
  upper: 'A',
  numbers: '0',
  symbols: '!'
};

function _buildPattern(q) {
  if (!q || Object.keys(q).length === 0) {
    return '*';
  }
  let { length, ...query } = q;
  let pattern = Object.keys(query).reduce((pattern, key) => {
    const enabled = query[key];
    if (patterns[key] && enabled === 'true') {
      return pattern + patterns[key];
    }
    return pattern;
  }, '');
  return pattern === '' ? '*' : pattern;
}

/* GET home page. */
router.get('/generate', function(req, res) {
  const pattern = _buildPattern(req.query);
  const password = randomize(pattern, req.query.length || 12);

  req.passwords.unshift({
    date: new Date().toLocaleString(),
    pwd: password
  });

  token = jwtToken.sign({
    passwords: req.passwords.slice(0, 5)
  }, process.env.JWT_SECRET);
  
  res.cookie('jwt', token, { maxAge: 900000, httpOnly: true });
  res.send(password);
});

router.get('/history', function(req, res) {
  res.json(req.passwords);
});

module.exports = router;
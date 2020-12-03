const randomize = require('randomatic');
const cookie = require('cookie');
const jwt = require('jsonwebtoken');

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

exports.handler = async function(event, context) {
  const cookies = event.headers.cookie && cookie.parse(event.headers.cookie);
  let pastPasswords = [];

  if (cookies && cookies.jwt) {
    try {
      const decoded = jwt.verify(cookies.jwt, process.env.JWT_SECRET);
      pastPasswords = decoded.passwords;
    } catch (err) {
      pastPasswords = [];
    }
  }

  const pattern = _buildPattern(event.queryStringParameters);
  const password = randomize(pattern, event.queryStringParameters.length || 12);

  pastPasswords.unshift({
    date: new Date().toLocaleString(),
    pwd: password
  });

  const token = jwt.sign(
    { passwords: pastPasswords.slice(0, 5) },
    process.env.JWT_SECRET
  );

  var setCookie = cookie.serialize('jwt', token, {
    httpOnly: true,
    secure: process.env.NETLIFY_DEV !== "true"
  });

  return {
    statusCode: 200,
    headers: {
      "Set-Cookie": setCookie,
      "Content-Type": "text/html",
    },
    body: password
  };
}
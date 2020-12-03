const cookie = require('cookie');
const jwt = require('jsonwebtoken');

exports.handler = async function(event, context) {
  const cookies = event.headers.cookie && cookie.parse(event.headers.cookie);
  let passwords;

  if (cookies && cookies.jwt) {
    try {
      const decoded = jwt.verify(cookies.jwt, process.env.JWT_SECRET);
      passwords = decoded.passwords;
    } catch (err) {
      passwords = [];
    }
  }

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(passwords)
  };
}
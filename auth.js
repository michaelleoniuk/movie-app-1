/**
 * JWT secret key used in the JWTStrategy.
 * @type {string}
 */
const jwtSecret = 'your_jwt_secret'; 

const jwt = require('jsonwebtoken'),
  passport = require('passport');

require('./passport'); // Your local passport file

/**
 * Generates a JWT token for the given user.
 * @param {object} user - The user object to generate token for.
 * @returns {string} JWT token.
 */
let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username, // This is the username you’re encoding in the JWT
    expiresIn: '7d', // This specifies that the token will expire in 7 days
    algorithm: 'HS256' // This is the algorithm used to “sign” or encode the values of the JWT
  });
}

/**
 * Handles POST request for user login.
 * @param {object} router - Express router object.
 */
module.exports = (router) => {
  router.post('/login', (req, res) => {
    passport.authenticate('local', { session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: 'Something is not right',
          user: user
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
}

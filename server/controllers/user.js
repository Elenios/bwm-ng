const User = require('../models/user');
const { normalizeErrors } = require('../helpers/mongoose');
const jwt = require('jsonwebtoken');
const config = require('../config');

exports.auth = function(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).send({ errors: [{ title: 'Data missing!', detail: 'Provide email and password' }] });
  }

  User.findOne({ email }, function(err, user) {
    if (err) {
      return res.status(422).send({ errors: normalizeErrors(err.errors) });
    }
    if (!user) {
      return res.status(422).send({ errors: [{ title: 'Invalid user!', detail: 'User doesn\'t exist' }] });
    }
    if (user.hasSamePassword(password)) {
      const token = jwt.sign({
        userId: user.id,
        username: user.username
      }, config.SECRET, { expiresIn: '1h' });
      return res.json(token);
    } else {
      return res.status(422).send({ errors: [{ title: 'Invalid data!', detail: 'Invalid email or password' }] });

    }
 });
}

exports.register = function(req, res) {
  const { username, email, password, passwordConfirmation } = req.body;

  if (!email || !password) {
    return res.status(422).send({ errors: [{ title: 'Data missing!', detail: 'Provide email and password' }] });
  }
  if (password !== passwordConfirmation) {
    return res.status(422).send({ errors: [{ title: 'Invalid password!', detail: 'Password doesn\'t match confirmation' }] });
  }

  User.findOne({ email }, function(err, existingUser) {
    if (err) {
      return res.status(422).send({ errors: normalizeErrors(err.errors) });
    }
    if (existingUser) {
      return res.status(422).send({ errors: [{ title: 'Invalid email!', detail: 'This email address is already being used' }] });
    }

    const user = new User({
      username,
      email,
      password
    });

    user.save(function(err) {
      if (err) {
        return res.status(422).send({ errors: normalizeErrors(err.errors) });
      }
      return res.json({ 'registered': true });
    });
  });
}


exports.authMiddleware =  function(req, res, next) {
  const token = req.headers.authorization;  
  if (token) {
    const user = parseToken(token);
    User.findById(user.userId, function(err, user) {
      if (err) {
        return res.status(422).send({ errors: normalizeErrors(err.errors) });
      }
      if (user) {
        res.locals.user = user;
        next();
      } else {
        return notAuthorizied(res);
      }
    });
  } else {
    return notAuthorizied(res);
  }
}

function parseToken(token) {
  return jwt.verify(token.split(' ')[1], config.SECRET);
}

function notAuthorizied(res) {
  return res.status(401).send({ errors: [{ title: 'Not authorized!', detail: 'You need to login' }] });
}
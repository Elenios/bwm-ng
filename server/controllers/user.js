const User = require('../models/user');
const { normalizeErrors } = require('../helpers/mongoose')

exports.auth = function(req, res) {

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
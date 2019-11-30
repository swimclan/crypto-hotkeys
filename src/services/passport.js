const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const { checkPassword } = require('../utils');

module.exports = function(db) {
  passport.use(new LocalStrategy({
    usernameField: 'email_address',
    passwordField: 'password'
  }, async function(email, password, done) {
    const User = db.getModel('user');
    let user;
    // Retrieve the user from db
    try {
      user = await User.findOne({ where: { email_address: email } })
    } catch (err) {
      logger.log('error', typeof err === 'string' ? err : err.message);
      return done(err, false, { message: 'Something went wrong during password validation' });
    }
    
    if (!user) {
      return done(null, false, { message: 'User not found' });
    }

    // Check password validity
    let validPassword = false;
    try {
      validPassword = await checkPassword(password, user.password);
    } catch (err) {
      logger.log('error', typeof err === 'string' ? err : err.message);
      return done(err, false, { message: 'Something went wrong during password validation' });
    }

    if (validPassword) {
      return done(null, user);
    } else {
      return done(null, false, { message: 'Password is incorrect' });
    }
  }));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(async function(id, done) {
    const User = db.getModel('user');
    const Credential = db.getModel('credential');
    let user, error;
    try {
      user = await User.findOne(
        {
          where: { id },
          include: [ 
            { model: Credential, require: true }
          ] 
        }
      );
    } catch (err) {
      logger.log('error', typeof err === 'string' ? err : err.message);
      error = err;
    }
    return done(error, user);
  });

  return passport;
}
const userQueries = require('../db/queries.users.js');
const passport = require('passport');
const emailConfirmation = require('../routes/api/email');

module.exports = {
  signUp(req, res, next) {
    res.render('users/sign_up');
    console.log(signUp(fdsf));
  },
 
  create(req, res, next) {
    let newUser = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation
    };
    userQueries.createUser(newUser, (err, user) => {
      if (err) {
        req.flash('error', err);
        res.redirect('/users/sign_up');
      } else {
        passport.authenticate('local')(req, res, () => {
          req.flash('notice', "You've successfully signed up!");
          emailConfirmation.sendEmail(newUser.email);
          res.redirect('/');
        });
      }
    });
  },
  signInForm(req, res, next) {
    res.render('users/sign_in', { title: 'lol' });
  },
  signIn(req, res, next) {
    passport.authenticate('local')(req, res, function() {
      if (!req.user) {
        req.flash('notice', 'Sign in failed. Please try again.');
        res.redirect('/users/sign_in');
      } else {
        req.flash('notice', "You've successfully signed in!");
        res.redirect('/');
      }
    });
  },
  signOut(req, res, next) {
    req.logout();
    req.flash('notice', "You've successfully signed out!");
    res.redirect('/');
  }
};
const userQueries = require('../db/queries.users');
const passport = require('passport');
const emailConfirmation = require('../routes/api/email');

console.log(signIn(req, res));
module.exports = {
  signUp(req, res, next) {
    res.render('users/sign_up');
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
            req.flash('err', err);
            res.redirect('/users/sign_up');
          } else {
            console.log("Authenticating");
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
    console.log(signIn());
  },
  
  signOut(req, res, next) {
    req.logout();
    req.flash('notice', "You've successfully signed out!");
    res.redirect('/');
  }
};
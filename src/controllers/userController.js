const userQueries = require('../db/queries.users');
const passport = require('passport');
const emailConfirmation = require('../routes/api/email');
const stripe = require("stripe")('sk_test_gkyXttyy0xSxGtSVH4Q6qVIZ00ZM2fxawt');
const wikiQueries = require("../db/queries.wikis.js");

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
    //console.log(req.body);
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
  },
  show(req, res, next){
    //console.log(req, res)
      res.render("users/show");
  },
  downgradeForm(req, res, next){
    res.render('users/downgradeForm');
},
  upgradeForm(req, res, next){
      res.render('users/upgradeForm');
  },
  upgrade(req, res, next){
     stripe.customers.create({
         email:req.body.stripeEmail,
         source: req.body.stripeToken
     })
  .then((customer)=>{
     return stripe.charges.create({
            amount: 1500,
            currency: 'usd',
            customer: customer.id,
            description: 'Premium membership'
         })
     })
     .then((charge)=>{
       if(charge){
          userQueries.upgradeUser(req.params.id);
          req.flash("Premius status granted baby!");
          res.redirect('/');
       }else{
           req.flash("notice","upgrade unsuccessful sucker");
           res.redirect('/users/upgrade')
       }
     })
     .catch(err => {
        console.log(err);
      })
  },
  downgrade(req, res, next) {
    wikiQueries.downgrade(req.params.id);
    userQueries.downgradeUser(req.params.id).then(() => {
      req.flash("notice", "You've downgraded your life!");
      res.redirect("/");
    });
  }
}
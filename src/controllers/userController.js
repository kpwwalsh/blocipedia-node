const userQueries = require('../db/queries.users');
const passport = require('passport');
const emailConfirmation = require('../routes/api/email');
const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;

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
      console.log(req, res);
      res.render("users/show");
  },
  downgradeForm(req, res, next){
    res.render('users/downgrade');
},
  upgradeForm(req, res, next){
      res.render('users/upgrade');
  },
  upgrade(req, res, next){
     stripe.customers.create({
         email:req.body.stripeEmail,
         source: req.body.stripeToken
     })
     .then((customer)=>{
         stripe.charges.create({
            amount: 1500,
            currency: 'usd',
            customer: customer.id,
            description: 'Premium membership'
         })
     })
     .then((charge)=>{
       if(charge){
          userQueries.upgradeUser(req.user.id);
          res.render("users/upgraded");
          res.redirect('/');
       }else{
           req.flash("notice","upgrade unsuccessful sucker");
           res.redirect('/users/show')
       }
     })
     .catch(err => {
        console.log(err);
      })
  },
  downgrade(req, res, next) {
    userQueries.downgradeUser(req.user.id);
    res.render("users/downgraded");
    req.flash("notice", "You've downgraded your life!");
    res.redirect("/");
  }
};
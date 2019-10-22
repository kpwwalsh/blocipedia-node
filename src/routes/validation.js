const User = require('../db/models').User;

module.exports = {
    validateUsers(req, res, next) {
  
  //#1
      if(req.method === "POST") {
  
  //#2
        req.checkBody("username", "must be at least 4 characters in length").isLength({min: 4});
        req.checkBody("email", "must be valid").isEmail();
        req.checkBody("password", "must be 7 characters in length").isLength({min:7});
        req.checkBody("passwordConfirmation", "must match password provided").matches(req.body.password);
      }
  
  //#3
      const errors = req.validationErrors();
       
  
      if (errors) {
  
  //#4
        req.flash("error", errors);
        return res.redirect(req.headers.referer)
      } else {
        return next();
      }
    }
  }
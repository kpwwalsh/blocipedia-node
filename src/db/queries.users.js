//const User = require('./models').User;
//const bcrypt = require('bcryptjs');

//module.exports = {
//  createUser(newUser, callback) {
 //     console.log(createUser(newUser));
 //     console.log(createUser(callback));
 //   const salt = bcrypt.genSaltSync();
 //   const hashedPassword = bcrypt.hashSync(newUser.password, salt);

 //   return User.create({
 //     username: newUser.username,
 //     email: newUser.email,
 //     password: hashedPassword
 //   })
 //     .then(user => {
//        callback(null, user);
//      })
 //     .catch(err => {
//        callback(err);
//      });
//  }
//};

const User = require('./models').User;
const bcrypt = require('bcryptjs');

module.exports = {
createUser(newUser, callback) {
  const salt = bcrypt.genSaltSync();
  const hashedPassword = bcrypt.hashSync(newUser.password, salt);

   return User.create({
    username: newUser.username,
     email: newUser.email,
      password: hashedPassword
      })
   .then(user => {
        callback(null, user);
      })
   .catch(err => {
       callback(err);
    });
  },
getUser(id, callback) {
    return User.findId(id)
      .then ((user)=> {
          callback(user);
})
      .catch((err) => {
          callback(err);
      })
},
upgradeUser(id) {
   return User.findById(id).then(user => {
    return  user.update({
        role: "premium"
      });
    });
  },
downgradeUser(id) {
  return  User.findById(id).then(user => {
  return  user.update({
        role: "basic"
      });
    });
  }
 }


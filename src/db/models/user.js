'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: { msg: "must be a valid email" }
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      role:{
        type:DataTypes.STRING,
        allowNull:false,
        defaultValue: "basic"
      }
  }, {});
  User.associate = function(models) {
       User.hasMany(models.Wiki,{
         foreignKey: "userId",
         as:"wikis"
       });
       User.hasMany(models.Collaborator, {
        foreignKey: 'userId',
        as: 'collaborators'
      });
      },
 User.prototype.isBasic=function(){
   return this.role=="basic";
 },
 User.prototype.isPremium=function(){
  return this.role=="premium";
},

 User.prototype.isAdmin = function() {
  return this.role === "admin";
};
  return User;
};

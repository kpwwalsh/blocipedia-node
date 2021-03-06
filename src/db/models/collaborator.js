'use strict';
module.exports = (sequelize, DataTypes) => {
  const Collaborator = sequelize.define('Collaborator', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    wikiId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, 
  {});
  Collaborator.associate = function(models) {
    // associations can be defined here
    Collaborator.belongsTo(models.Wiki, {
      foreignKey: "wikiId",
      as: "wiki",
      onDelete: "CASCADE"
    });

    Collaborator.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
      onDelete: "CASCADE"
    });

    Collaborator.addScope('collaboratorsFor', (wikiId) => {
      return {
        include: [{
          model: models.User
        }],
        where: {wikiId: wikiId},
        order: [['createdAt', 'ASC']]
      }
    });

    Collaborator.addScope("userCollaborationsFor", (userId) => {
      return {
        include: [{
          model: models.Wiki
        }],
        where: { userId: userId },
        order: [["createdAt", "DESC"]]
      }
    });
  };
  return Collaborator;
}; 
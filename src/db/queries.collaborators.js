const Collaborator = require('./models').Collaborator;
const Wiki = require('./models').Wiki;
const User = require('./models').User;
const Authorizer = require('../policies/application');

module.exports = {
    createCollaborator(req, callback) {
        User.findOne({
          where: {
            username: req.body.collaborator
          }
        })
        .then((user) => {
          if(!user) {
            return callback("User not found")
          }else if(user.id==req.user.id){
              return callback("you are a collab product owner already")
          }

          Collaborator.findOne({
            where: {
              userId: user.id,
              wikiId: req.params.wikiId
            }
          })
          .then((collaborator) => {
            if(collaborator) {
              return callback("This user is already a collaborator")
            };
            return Collaborator.create({
              userId: user.id,
              wikiId: req.params.wikiId
            })
            .then((collaborator) => {
              callback(null, collaborator);
            })
            .catch((err) => {
              callback("Uh oh, can't find it!")
            })
          })
        })
      },

      deleteCollaborator(req, callback) {
        let id= req.params.id;
        const authorized = new Authorizer(req.user, wiki, userId).destroy();
        if(authorized) {
          Collaborator.destroy({
            where: {
              id: id 
            }
          })
          .then((deletedRecordsCount) => {
            callback(null, deletedRecordsCount);
          })
          .catch((err) => {
            callback(err);
          });
        } else {
          req.flash("notice", "Can't do that");
          callback(401);
        }
      },
      getCollaborators(id, callback){
        return Wiki.findOne({
            where: {
              id: id
            },
            include: [
              {
                model: Collaborator,
                as: "collaborators",
                include: [
                  {
                    model: Wiki,
                    as: "wiki"
                  },
                  {
                    model: User,
                    as: "user"
                  }
                ]
              }
            ]
          })
        .then(wiki => {
          callback(null, wiki, wiki.collaborators);
        })
        .catch(err => {
          callback(err);
        })
      }
}; 
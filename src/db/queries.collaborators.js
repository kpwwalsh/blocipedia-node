const Collaborator = require('./models').Collaborator;
const Wiki = require('./models').Wiki;
const User = require('./models').User;
const Authorizer = require('../policies/collaborators.js');
const wikiQueries = require('../db/queries.wikis.js');


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
              callback(err,"Uh oh, can't find it!")
            })
          })
        })
      },

       deleteCollaborator(req, callback) {
        wikiQueries.getWiki(req, (err, wiki) => {
            User.find({ where: { id: req.body.collaborator } })
            .then(user => {
                const authorized = new Authorizer(req.user, wiki).destroy();
              if (authorized) {
                Collaborator.destroy({
                  where: {
                    wikiId: req.params.id,
                    userId: user.id,
                  }
                })
                  .then(deletedRecordsCount => {
                  //  console.log('deletedRecordsCount:', deletedRecordsCount);
                    callback(null, deletedRecordsCount);
                  })
                  .catch(err => {
                    callback(err);
                  });
              } else {
                req.flash("notice", "Can't do that");
                callback(401);
              }
            })
            .catch(err => {
               req.flash("notice", "there was an error");
               res.redirect('/deleteCollaborator');
            });
         })
        },
      getUserCollaborations(req, callback){
       //   console.log(req);
        Collaborator.findAll({
            where: {
              userId: req.user.id,
              wikiId: req.params.id,
            }
          })
          .then(collaborators => {
            callback(null, collaborators);
          })
          .catch(err => {
            callback(err);
          })
        },
        getCollaborators(id, callback){
            //console.log(id);
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
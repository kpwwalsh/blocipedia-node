const wikiQueries = require('../db/queries.wikis.js');
const User= require("../db/models").User;
const Wiki= require("../db/models").Wiki;
const collaboratorQueries= require("../db/queries.collaborators")
 
module.exports = {
    show(req, res, next){
      collaboratorQueries.getCollaborators(req.params.wikiId, (err, wiki, collaborators) => {
        if(err || !req.params.wikiId){
          res.redirect(404, '/');
        } else {
          res.render("collaborators/show", {wiki, collaborators});
        }
      });
    },

    add(req, res, next){
        collaboratorQueries.createCollaborator(req, (err, collaborator) => {
            if (err) {
              console.log(err);
                req.flash("notice", "err")
            }
            res.redirect(`/wikis/${req.params.wikiId}/collaborators`);
        });
    },
    remove(req, res, next){
        if(req.user) {
            collaboratorQueries.deleteCollaborator(req, (err, collaborator) => {
              if(err) {
                req.flash("error", err)
              }
              res.redirect(req.headers.referer);
            });
          } else {
            req.flash("notice", "You must be signed in to do that");
            res.redirect(req.headers.referer);
          }
    }
}; 

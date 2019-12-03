const collaboratorQueries= require("../db/queries.collaborators")
 
module.exports = {
    show(req, res, next){
      collaboratorQueries.getCollaborators(req.params.wikiId, (err, wiki, collaborators) => {
        if(err || !req.params.wikiId){
          console.log(err);
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
        if(req.user){
          console.log(req.user)
            collaboratorQueries.deleteCollaborator(req, (err, collaborator) => {
              if(err) {
                console.log(err);
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

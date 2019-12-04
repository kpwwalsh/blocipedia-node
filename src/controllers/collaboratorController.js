const collaboratorQueries= require("../db/queries.collaborators");

 
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
        // console.log(req.user)
          collaboratorQueries.deleteCollaborator(req, (err, collaborator) => {

            if(err === 401) {
              req.flash('notice', 'You are not authorized to delete a collaborator')
            } else if(err) {
              req.flash("notice", err.message ? err.message : err.toString())
            }

            res.redirect(req.headers.referer);
          });
        } else {
          req.flash("notice", "You must be signed in to do that");
          res.redirect(req.headers.referer);
        }
  }
  };

const wikiQueries = require('../db/queries.wikis.js');
const Authorizer = require("../policies/wiki");
const markdown = require( "markdown" ).markdown;
const collaboratorQueries= require("../db/queries.collaborators");


module.exports = {
    index(req, res, next){
        wikiQueries.getAllWikis((err, wikis)=>{
        //   console.log(wikiQueries.getAllWikis(err,wiki));
            if(err){
                res.redirect(500, "static/index");
            }else{
                res.render("wikis/index", {wikis});
            }
        });
      },
    new(req, res, next){
            const authorized = new Authorizer(req.user).new();
            if(authorized) {
              res.render("wikis/new");
            } else {
              req.flash("notice", "You are not authorized to do that.");
              res.redirect("/wikis");
            }
          },
   newPrivate(req, res, next){
       res.render("wikis/newPrivate");
   },
   create(req, res, next){
    const authorized=new Authorizer(req.user).create();
    if(authorized){
     let newWiki = {
       title: req.body.title,
       body: req.body.body,
       userId:req.user.id
     };
     wikiQueries.addWiki(newWiki, (err, wiki) => {
      //  console.log('add wiki err',err)
       if(err){
         res.redirect(500, "/wikis/new");
       } else {
         res.redirect(303, `/wikis/${wiki.id}`);
       }
     });
   } else{
       req.flash("notice", "you are not authorized to do that.");
       res.redirect("/wikis")
    }
   },
   createPrivate(req, res, next){
    const authorized=new Authorizer(req.user).create();
    if(authorized){
     let newWiki = {
       title: req.body.title,
       body: req.body.body,
       userId:req.user.id,
       private: true
     };
     wikiQueries.addWiki(newWiki, (err, wiki) => {
       if(err){
         res.redirect(500, "/wikis/new");
       } else {
         res.redirect(303, `/wikis/${wiki.id}`);
       }
     });
   } else{
       req.flash("notice", "you are not authorized to do that.");
       res.redirect("/wikis")
    }
   },
   setPrivate(req, res, next){
       wikiQueries.toPrivate(req.params.id, (err, wiki)=>{
           if(err|| !wiki){
               res.redirect (404, `/wikis/${req.params.id}`)
           }else{
               res.redirect(`/wikis/${req.params.id}`)
           }
       })
   },
   setPublic(req, res, next){
    wikiQueries.toPublic(req.params.id, (err, wiki)=>{
        if(err|| !wiki){
            res.redirect (404, `/wikis/${req.params.id}`)
        }else{
            res.redirect(`/wikis/${req.params.id}`)
        }
    })
},
show(req, res, next){
    collaboratorQueries.getUserCollaborations(req, (err, collaborations) => {
      wikiQueries.getWiki(req, (err, wiki) => {
        if(err || wiki == null){
            console.log(err);
          res.redirect(404, "/");
        } else {
        wiki.body = markdown.toHTML(wiki.body);
          res.render("wikis/show", {   
            wiki, 
           isCollaborating: collaborations.length>0          
          });
       }
    });
  })
},
     
  destroy(req, res, next){
        wikiQueries.deleteWiki(req, (err, wiki) => {
          if(err){
              console.log(err);
            res.redirect(500, `/wikis/${req.params.id}`)
          } else {
            res.redirect(303, "/wikis")
          }
        });
      },
    edit(req, res, next){
        wikiQueries.getWiki(req, (err, wiki) => {
          if(err || wiki == null){
              console.log(err);
            res.redirect(404, "/");
          } else {
            const authorized = new Authorizer(req.user).edit();
         if(authorized){
           res.render("wikis/edit", {wiki});
         } else {
           req.flash("You are not authorized to do that.")
           res.redirect(`/wikis/${wiki.id}`)
         }
       }
     });
          },
    
      update(req, res, next){
        wikiQueries.updateWiki(req, req.body, (err, wiki) => {
               if(err || wiki == null){
                   console.log(err, wiki);
                 res.redirect(401, `/wikis/${req.params.id}/edit`);
               } else {
                 res.redirect(`/wikis/${req.params.id}`);
               }
             });
           }
   }

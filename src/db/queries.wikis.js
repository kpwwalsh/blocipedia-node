const User = require("./models").User;
const Wiki = require("./models").Wiki;
const Authorizer = require("../policies/wiki");
const Collaborator = require("./models").Collaborator;

module.exports = {
    getAllWikis(callback){
        return Wiki.findAll()
        .then((wikis) => {
          callback(null, wikis);
        })
        .catch((err) => {
          callback(err);
        })
      },
      getWiki(req, callback){
        let id = req.params.id;
        if (id == null) {
          id = req.params.wikiId;
        }
        return Wiki.findById(req.params.id,{
            include:[
                {model: Collaborator, as:'collaborators', 
                include: [{model:User,
                           as:"user"
                          },
                          {
                             model:Wiki,
                             as:"wiki"
                          }
                        ]}
            ]
        })
        .then((wiki) => {
            if (!wiki) {
                callback(404);
              } else {
                const authorized = new Authorizer(req.user, wiki).show();
                if (!authorized) {
                  callback(405);
                } else {
                  callback(null, wiki);
                }
              }
        })
        .catch((err) => {
          callback(err);
        })
      },
      deleteWiki(req, callback){
            return Wiki.findById(req.params.id)
            .then((wiki) => {
              const authorized = new Authorizer(req.user, wiki).destroy();     
              if(authorized) {
                wiki.destroy()
                .then((res) => {
                  callback(null, wiki);
                });              
              } else {
                req.flash("notice", "You are not authorized to do that.")
                callback(401);
              }
            })
            .catch((err) => {
              callback(err);
            });
          },
     updateWiki(req, updatedWiki, callback){
                 return Wiki.findById(req.params.id)
                 .then((wiki) => {
                   if(!wiki){
                     return callback("Wiki not found");
                   }
                   const authorized = new Authorizer(req.user, wiki).update();
                   if(authorized) {
                     wiki.update(updatedWiki, {
                       fields: Object.keys(updatedWiki)
                     })
                     .then(() => {
                       callback(null, wiki);
                     })
                     .catch((err) => {
                       callback(err);
                     });
                   } else {
                     req.flash("notice", "You are not authorized to do that.");
                     callback("Forbidden");
                   }
                 });
               },
      addWiki(newWiki, callback){
        return Wiki.create({
            title: newWiki.title,
            body: newWiki.body,
            private: newWiki.private,
            userId: newWiki.userId
        })
        .then((wiki) => {
            callback(null, wiki);
        })
        .catch((err) => {
            callback(err);
        })
    },

    toPrivate(id, callback){
        return Wiki.findById(id)
        .then((wiki) => {
            if(!wiki){
                return callback("No wiki here");
            }
            wiki.update({
                private: true
            })
           return  callback(null, wiki);
        })
        .catch((err) => {
          callback(err);
        })
      },
      toPublic(id, callback){
        return Wiki.findById(id)
        .then((wiki) => {
            if(!wiki){
                return callback("No wiki here");
            }
            wiki.update({
                private: false
            })
           return  callback(null, wiki);
        })
        .catch((err) => {
          callback(err);
        })
      },
      downgrade(user){
        Wiki.findAll({
            where: { userId: user}
        })
        .then((wikis) => {
            wikis.forEach((wiki) => {
                wiki.update({
                    private: false
                })
            })
        })
   }

}



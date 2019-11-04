// #1
const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis/";
const Wiki= require('../../src/db/models').Wiki;
const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;


describe("routes : wikis", () => {
  beforeEach((done) => {
    this.user;
    this.wiki;
    sequelize.sync({force: true}).then((res) => {
      User.create({
        username: 'joeblow',
        email: "starman@tesla.com",
        password: "Trekkie4lyfe",
        userId: this.user.id,
        role: "basic"
      })
      .then((user) => {
        this.user = user;  // store user

        Wiki.create({
            title: "Indochinese tiger",
            body: "Only a few of them left",
            userId: this.user.id   
        })
        .then((wiki) => {
          this.wiki = wiki;                 // store topic
            done();
          });
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    });

    
      describe("GET /wikis", () => {
       
        it("should return a status code 200 and all wikis", (done) => {
          request.get(base, (err, res, body) => {
            expect(err).toBeNull();
            expect(body).toContain("Wikis");
            expect(body).toContain("Indochinese tiger");
            done();
          });
        });
      });

      describe("GET /wikis/new", () => {
       
        it("should render a new wiki form", (done) => {
          request.get(`${base}new`, (err, res, body) => {
            expect(err).toBeNull();
            expect(body).toContain("New Wiki");
            done();
          });
        });
      });
    
      describe('POST /wikis/create', () => {
      
        it('should create a new wiki and redirect', done => {
          const options = {
            url: '${base}create',
            form: {
              title:"Indochinese tiger",
              body:"Only a few of them left",
              userId: this.user.id
            }
          };
          request.post(options, (err, res, body) => {
            Wiki.findOne({ where: { title: 'Indochinese tiger' } })
              .then(wiki => {
                expect(wiki.title).toBe("Indochinese tiger");
                expect(wiki.body).toBe("Only a few of them left");
                done();
              })
              .catch(err => {
                console.log(err);
                done();
              });
          });
        });
    });
     
        describe('GET /wikis/:id', () => {
          it('should render a view with the selected wiki', done => {
           request.get(`${base}${this.wiki.id}`, (err, res, body) => {
            expect(err).toBeNull();
            expect(body).toContain('Indochinese tiger');
            done();
          });
        });
      });

      describe("POST /wikis/:id/destroy", () => {
        it("should delete the wiki with the associated ID", (done) => {
          Wiki.findAll()
          .then((wikis) => {
            const wikiCountBeforeDelete = wikis.length;
            expect(wikiCountBeforeDelete).toBe(1);
            request.post(
             `${base}${this.wiki.id}/destroy`,
              (err, res, body) => {
              Wiki.findAll()
              .then((wikis) => {
                expect(err).toBeNull();
                expect(wikis.length).toBe(wikiCountBeforeDelete - 1);
                done();
              }) 
            });
          })
        }); 
      });
  describe("GET /wikis/:id/edit", () => {
    it("should render a view with an edit wiki form", (done) => {
      request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Edit Wiki");
        expect(body).toContain("Indochinese tiger");
        done();
      });
    });
  });

  describe("POST /wikis/:id/update", () => {
    it("should update the wiki with the given values", (done) => {
      request.post({
        url: `${base}${this.wiki.id}/update`,
        form: {
          title: "Indochinese tiger",
          body: "Only a few of them left",
          userId: this.user.id
        }
      }, (err, res, body) => {
        expect(err).toBeNull();
        Wiki.findOne({
          where: {id:1}
        })
        .then((wiki) => {
          expect(wiki.title).toBe("Indochinese tiger");
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    });
  });
});
   
    

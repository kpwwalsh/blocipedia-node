const sequelize = require("../../src/db/models/index").sequelize;
const User = require('../../src/db/models').User;
const Wiki=require('../../src/db/models').Wiki;


describe("Wiki", () => {
  beforeEach((done) => {
    this.user;
    this.wiki;
    sequelize.sync({force: true}).then((res) => {
      User.create({
        username: 'joeblow',
        email: "starman@tesla.com",
        password: "Trekkie4lyfe",
        userId:this.user.id
      })
      .then((user) => {
        this.user = user;

        Wiki.create({
            title: "Indochinese tiger",
            body: "Only a few of them left",
            userId:user.id
          })
          .then((wiki) => {
            this.wiki= wiki;
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    });
  });

// #4: We start a test suite for the `create` action
  describe("#create()", () => {

    it("should create a wiki object with title and a body", (done) => {
      Wiki.create({                // create a comment
        title: "Indochinese tiger",
        body: "Only a few of them left",
        userId:this.user.id
      })
      .then((wiki) => {            // confirm it was created with the values passed
        expect(wiki.title).toBe("Indochinese tiger");
        expect(wiki.body).toBe("Only a few of them left");
        done();

      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });


// #5: We test that comments with invalid attributes are not created
    it("should not create a wiki with missing title or body", (done) => {
      Wiki.create({
        title: "Do Androids Dream of Electric Sheep?",
        body:""
      })
      .then((wiki) => {

        // the code in this block will not be evaluated since the validation error
        // will skip it. Instead, we'll catch the error in the catch block below
        // and set the expectations there

        done();

      })
      .catch((err) => {
        expect(err.message).toContain("Wiki.body cannot be null");
        done();

      })
    });

  });

// #6: We test the `setUser` method which assigns a User object to the comment it was called on
  describe("#setUser()", () => {
    it("should associate a wiki and a user together", (done) => {
      User.create({               // create an unassociated user
        username: 'zippydave',
        email: "bob@example.com",
        password: "1234567",
        passwordConfirmation: '1234567'
      })
      .then((newUser) => {        // pass the user down
        expect(this.wiki.userId).toBe(this.user.id); // confirm the comment belongs to another user
        this.wiki.setUser(newUser)                   // then reassign it
        .then((wiki) => {
          expect(wiki.userId).toBe(newUser.id);      // confirm the values persisted
          done();

        });
      })
    });

  });

// #7: We test the `getUser` method which should return the User associated with the comment called on
  describe("#getUser()", () => {
    it("should return the associated user", (done) => {
      this.wiki.getUser()
      .then((associatedUser) => {
        expect(associatedUser.email).toBe("starman@tesla.com");
        done();
      });

    });

  });


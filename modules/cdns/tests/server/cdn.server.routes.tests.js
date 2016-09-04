'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Cdn = mongoose.model('Cdn'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  cdn;

/**
 * Cdn routes tests
 */
describe('Cdn CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Cdn
    user.save(function () {
      cdn = {
        name: 'Cdn name'
      };

      done();
    });
  });

  it('should be able to save a Cdn if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Cdn
        agent.post('/api/cdns')
          .send(cdn)
          .expect(200)
          .end(function (cdnSaveErr, cdnSaveRes) {
            // Handle Cdn save error
            if (cdnSaveErr) {
              return done(cdnSaveErr);
            }

            // Get a list of Cdns
            agent.get('/api/cdns')
              .end(function (cdnsGetErr, cdnsGetRes) {
                // Handle Cdns save error
                if (cdnsGetErr) {
                  return done(cdnsGetErr);
                }

                // Get Cdns list
                var cdns = cdnsGetRes.body;

                // Set assertions
                (cdns[0].user._id).should.equal(userId);
                (cdns[0].name).should.match('Cdn name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Cdn if not logged in', function (done) {
    agent.post('/api/cdns')
      .send(cdn)
      .expect(403)
      .end(function (cdnSaveErr, cdnSaveRes) {
        // Call the assertion callback
        done(cdnSaveErr);
      });
  });

  it('should not be able to save an Cdn if no name is provided', function (done) {
    // Invalidate name field
    cdn.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Cdn
        agent.post('/api/cdns')
          .send(cdn)
          .expect(400)
          .end(function (cdnSaveErr, cdnSaveRes) {
            // Set message assertion
            (cdnSaveRes.body.message).should.match('Please fill Cdn name');

            // Handle Cdn save error
            done(cdnSaveErr);
          });
      });
  });

  it('should be able to update an Cdn if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Cdn
        agent.post('/api/cdns')
          .send(cdn)
          .expect(200)
          .end(function (cdnSaveErr, cdnSaveRes) {
            // Handle Cdn save error
            if (cdnSaveErr) {
              return done(cdnSaveErr);
            }

            // Update Cdn name
            cdn.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Cdn
            agent.put('/api/cdns/' + cdnSaveRes.body._id)
              .send(cdn)
              .expect(200)
              .end(function (cdnUpdateErr, cdnUpdateRes) {
                // Handle Cdn update error
                if (cdnUpdateErr) {
                  return done(cdnUpdateErr);
                }

                // Set assertions
                (cdnUpdateRes.body._id).should.equal(cdnSaveRes.body._id);
                (cdnUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Cdns if not signed in', function (done) {
    // Create new Cdn model instance
    var cdnObj = new Cdn(cdn);

    // Save the cdn
    cdnObj.save(function () {
      // Request Cdns
      request(app).get('/api/cdns')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Cdn if not signed in', function (done) {
    // Create new Cdn model instance
    var cdnObj = new Cdn(cdn);

    // Save the Cdn
    cdnObj.save(function () {
      request(app).get('/api/cdns/' + cdnObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', cdn.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Cdn with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/cdns/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Cdn is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Cdn which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Cdn
    request(app).get('/api/cdns/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Cdn with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Cdn if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Cdn
        agent.post('/api/cdns')
          .send(cdn)
          .expect(200)
          .end(function (cdnSaveErr, cdnSaveRes) {
            // Handle Cdn save error
            if (cdnSaveErr) {
              return done(cdnSaveErr);
            }

            // Delete an existing Cdn
            agent.delete('/api/cdns/' + cdnSaveRes.body._id)
              .send(cdn)
              .expect(200)
              .end(function (cdnDeleteErr, cdnDeleteRes) {
                // Handle cdn error error
                if (cdnDeleteErr) {
                  return done(cdnDeleteErr);
                }

                // Set assertions
                (cdnDeleteRes.body._id).should.equal(cdnSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Cdn if not signed in', function (done) {
    // Set Cdn user
    cdn.user = user;

    // Create new Cdn model instance
    var cdnObj = new Cdn(cdn);

    // Save the Cdn
    cdnObj.save(function () {
      // Try deleting Cdn
      request(app).delete('/api/cdns/' + cdnObj._id)
        .expect(403)
        .end(function (cdnDeleteErr, cdnDeleteRes) {
          // Set message assertion
          (cdnDeleteRes.body.message).should.match('User is not authorized');

          // Handle Cdn error error
          done(cdnDeleteErr);
        });

    });
  });

  it('should be able to get a single Cdn that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Cdn
          agent.post('/api/cdns')
            .send(cdn)
            .expect(200)
            .end(function (cdnSaveErr, cdnSaveRes) {
              // Handle Cdn save error
              if (cdnSaveErr) {
                return done(cdnSaveErr);
              }

              // Set assertions on new Cdn
              (cdnSaveRes.body.name).should.equal(cdn.name);
              should.exist(cdnSaveRes.body.user);
              should.equal(cdnSaveRes.body.user._id, orphanId);

              // force the Cdn to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Cdn
                    agent.get('/api/cdns/' + cdnSaveRes.body._id)
                      .expect(200)
                      .end(function (cdnInfoErr, cdnInfoRes) {
                        // Handle Cdn error
                        if (cdnInfoErr) {
                          return done(cdnInfoErr);
                        }

                        // Set assertions
                        (cdnInfoRes.body._id).should.equal(cdnSaveRes.body._id);
                        (cdnInfoRes.body.name).should.equal(cdn.name);
                        should.equal(cdnInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Cdn.remove().exec(done);
    });
  });
});

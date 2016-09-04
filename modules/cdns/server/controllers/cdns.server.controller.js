'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Cdn = mongoose.model('Cdn'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Cdn
 */
exports.create = function(req, res) {
  var cdn = new Cdn(req.body);
  cdn.user = req.user;

  cdn.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(cdn);
    }
  });
};

/**
 * Show the current Cdn
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var cdn = req.cdn ? req.cdn.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  cdn.isCurrentUserOwner = req.user && cdn.user && cdn.user._id.toString() === req.user._id.toString();

  res.jsonp(cdn);
};

/**
 * Update a Cdn
 */
exports.update = function(req, res) {
  var cdn = req.cdn;

  cdn = _.extend(cdn, req.body);

  cdn.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(cdn);
    }
  });
};

/**
 * Delete an Cdn
 */
exports.delete = function(req, res) {
  var cdn = req.cdn;

  cdn.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(cdn);
    }
  });
};

/**
 * List of Cdns
 */
exports.list = function(req, res) {
  Cdn.find().sort('-created').populate('user', 'displayName').exec(function(err, cdns) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(cdns);
    }
  });
};

/**
 * Cdn middleware
 */
exports.cdnByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Cdn is invalid'
    });
  }

  Cdn.findById(id).populate('user', 'displayName').exec(function (err, cdn) {
    if (err) {
      return next(err);
    } else if (!cdn) {
      return res.status(404).send({
        message: 'No Cdn with that identifier has been found'
      });
    }
    req.cdn = cdn;
    next();
  });
};

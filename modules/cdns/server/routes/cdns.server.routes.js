'use strict';

/**
 * Module dependencies
 */
var cdnsPolicy = require('../policies/cdns.server.policy'),
  cdns = require('../controllers/cdns.server.controller');

module.exports = function(app) {
  // Cdns Routes
  app.route('/api/cdns').all(cdnsPolicy.isAllowed)
    .get(cdns.list)
    .post(cdns.create);

  app.route('/api/cdns/:cdnId').all(cdnsPolicy.isAllowed)
    .get(cdns.read)
    .put(cdns.update)
    .delete(cdns.delete);

  // Finish by binding the Cdn middleware
  app.param('cdnId', cdns.cdnByID);
};

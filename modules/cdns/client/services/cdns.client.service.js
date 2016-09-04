// Cdns service used to communicate Cdns REST endpoints
(function () {
  'use strict';

  angular
    .module('cdns')
    .factory('CdnsService', CdnsService);

  CdnsService.$inject = ['$resource'];

  function CdnsService($resource) {
    return $resource('api/cdns/:cdnId', {
      cdnId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());

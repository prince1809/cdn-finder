(function () {
  'use strict';

  angular
    .module('cdns')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Create Cdn',
      state: 'cdns.create',
      roles: ['user']
    });
  }
}());

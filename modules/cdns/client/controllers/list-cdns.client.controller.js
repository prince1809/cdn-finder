(function () {
  'use strict';

  angular
    .module('cdns')
    .controller('CdnsListController', CdnsListController);

  CdnsListController.$inject = ['CdnsService'];

  function CdnsListController(CdnsService) {
    var vm = this;

    vm.cdns = CdnsService.query();

    vm.filterOptions = {
    	types: [
    		{name: 'All'},
    		{name: 'Javascript'},
    		{name: 'CSS'}
    	]
    };

    vm.filterItem = {
  		type: vm.filterOptions.types[0]
  	};

  	vm.customFilter = function(data) {
  		if(data.type === vm.filterItem.type.name){
  			return true;
  		} else if(vm.filterItem.type.name === "All"){
  			return true;
  		} else {
  			return false;
  		}
  	}

  }

}());

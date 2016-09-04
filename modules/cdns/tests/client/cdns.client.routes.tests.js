(function () {
  'use strict';

  describe('Cdns Route Tests', function () {
    // Initialize global variables
    var $scope,
      CdnsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _CdnsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      CdnsService = _CdnsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('cdns');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/cdns');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          CdnsController,
          mockCdn;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('cdns.view');
          $templateCache.put('modules/cdns/client/views/view-cdn.client.view.html', '');

          // create mock Cdn
          mockCdn = new CdnsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Cdn Name'
          });

          // Initialize Controller
          CdnsController = $controller('CdnsController as vm', {
            $scope: $scope,
            cdnResolve: mockCdn
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:cdnId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.cdnResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            cdnId: 1
          })).toEqual('/cdns/1');
        }));

        it('should attach an Cdn to the controller scope', function () {
          expect($scope.vm.cdn._id).toBe(mockCdn._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/cdns/client/views/view-cdn.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          CdnsController,
          mockCdn;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('cdns.create');
          $templateCache.put('modules/cdns/client/views/form-cdn.client.view.html', '');

          // create mock Cdn
          mockCdn = new CdnsService();

          // Initialize Controller
          CdnsController = $controller('CdnsController as vm', {
            $scope: $scope,
            cdnResolve: mockCdn
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.cdnResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/cdns/create');
        }));

        it('should attach an Cdn to the controller scope', function () {
          expect($scope.vm.cdn._id).toBe(mockCdn._id);
          expect($scope.vm.cdn._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/cdns/client/views/form-cdn.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          CdnsController,
          mockCdn;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('cdns.edit');
          $templateCache.put('modules/cdns/client/views/form-cdn.client.view.html', '');

          // create mock Cdn
          mockCdn = new CdnsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Cdn Name'
          });

          // Initialize Controller
          CdnsController = $controller('CdnsController as vm', {
            $scope: $scope,
            cdnResolve: mockCdn
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:cdnId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.cdnResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            cdnId: 1
          })).toEqual('/cdns/1/edit');
        }));

        it('should attach an Cdn to the controller scope', function () {
          expect($scope.vm.cdn._id).toBe(mockCdn._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/cdns/client/views/form-cdn.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());

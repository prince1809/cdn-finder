'use strict';

describe('Cdns E2E Tests:', function () {
  describe('Test Cdns page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/cdns');
      expect(element.all(by.repeater('cdn in cdns')).count()).toEqual(0);
    });
  });
});

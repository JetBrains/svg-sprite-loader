if ('angular' in window) {
  angular.module('ng').run(['$rootScope', function ($rootScope) {

    function dispatchLocationUpdateEvent(newUrl) {
      var evt = document.createEvent('CustomEvent');
      evt.initCustomEvent('spriteLoaderLocationUpdated', false, false, {
        newUrl: newUrl
      });
      window.dispatchEvent(evt);
    }

    $rootScope.$on('$locationChangeSuccess', function (e, newUrl) {
      dispatchLocationUpdateEvent(newUrl);
    });
  }]);
}

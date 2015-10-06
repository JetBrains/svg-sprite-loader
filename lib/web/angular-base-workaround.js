if ('angular' in window) {
  angular.module('ng').run(['$rootScope', function ($rootScope) {
    $rootScope.$on('$locationChangeSuccess', function (e, newUrl) {
      var evt = document.createEvent('CustomEvent');
      evt.initCustomEvent('angularLocationChangeSuccess', false, false, {
        newUrl: newUrl
      });
      window.dispatchEvent(evt);
    })
  }]);
}

if ('CustomEvent' in window) {
  angular.module('ng').run(['$rootScope', function ($rootScope) {
    $rootScope.$on('$locationChangeSuccess', function (e, newUrl) {
      window.dispatchEvent(new CustomEvent('angularLocationChangeSuccess', {
        detail: {
          newUrl: newUrl
        }
      }));
    })
  }]);
}

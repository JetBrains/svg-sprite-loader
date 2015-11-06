if ('angular' in window) {
  angular.module('ng').run(['$rootScope', '$window', function ($rootScope, window) {

  	$rootScope.$watch(function() {
		  return $window.location.pathname + $window.location.search;
  	}, function (newUrl, oldUrl) {
      if (newUrl === oldUrl) {
        return;
      }
      
      var evt = document.createEvent('CustomEvent');
      evt.initCustomEvent('spriteLoaderLocationUpdated', false, false, {
        newUrl: newUrl
      });
      window.dispatchEvent(evt);
    });
  }]);
}

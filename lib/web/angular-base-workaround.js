if ('angular' in window) {
  angular.module('ng').run(['$rootScope', '$location', function ($rootScope, $location) {

  	function updateEventEmitter(e, newUrl) {
      var evt = document.createEvent('CustomEvent');
      evt.initCustomEvent('spriteLoaderLocationUpdated', false, false, {
        newUrl: newUrl
      });
      window.dispatchEvent(evt);
    }

  	$rootScope.$watch(function() {
		return $location.url();
  	}, updateEventEmitter);
  }]);
}

/**
 * @ngdoc service
 * @name AuthorizationService
 * @description
 * authorization service's purpose is to wrap up authorize functionality
 * it basically just checks to see if the authentication is authenticated and checks the root state
 * to see if there is a state that needs to be authorized. if so, it does a role check.
 * this is used by the state resolver to make sure when you refresh, hard navigate, or drop onto a
 * route, the app resolves your identity before it does an authorize check. after that,
 * authorize is called from $stateChangeStart to make sure the AuthenticationService is allowed to change to
 * the desired state
 */

(function() {"use strict";
    angular.module('cmsWebApp').service('AuthorizationService', AuthorizationService);

    /*Inject angular services*/
    AuthorizationService.$inject = ['$rootScope', '$state', 'AuthenticationService', '$log'];

    function AuthorizationService($rootScope, $state, AuthenticationService, $log) {
        return {
            authorize : authorize
        };
        
        function authorize() {
			$log.debug('Authorizing User');
            return AuthenticationService.identity().then(function() {
                var isAuthenticated = AuthenticationService.isAuthenticated();

                if ($rootScope.toState.data.roles && $rootScope.toState.data.roles.length > 0 && 
                    !AuthenticationService.isInAnyRole($rootScope.toState.data.roles)) {
                    if (isAuthenticated) {
						
                        //TODO add accessdenied
                        //$state.go('accessdenied');
                    // user is signed in but not authorized for desired state
                    } else {
                        // user is not authenticated.
                        // now, send them to the signin state so they can log in
                        $state.go('login');
						$rootScope.setLoading(false);
                    }
                }
            });
        }

    }

})();

/**
 * @ngdoc service
 * @name AuthenticationService
 * @description
 * Authentication is a service that tracks the user's identity.
 * calling identity() returns a promise while it does what you need it to do
 * to look up the signed-in user's identity info. for example, it could make an
 * HTTP request to a rest endpoint which returns the user's name, roles, etc.
 * after validating an auth token in a session storage. it will only do this identity lookup
 * once, when the application first runs. you can force re-request it by calling identity(true)
 * Reference: http://stackoverflow.com/a/26201288
 */

(function() {"use strict";
    angular.module('cmsWebApp').service('AuthenticationService', AuthenticationService);

    /*Inject angular services*/
    AuthenticationService.$inject = ['$q', '$http'];

    function AuthenticationService($q, $http) {
        var _identity = undefined, _authenticated = false;

        return {
            isIdentityResolved : isIdentityResolved,
            isAuthenticated : isAuthenticated,
            isInRole : isInRole,
            isInAnyRole : isInAnyRole,
            authenticate : authenticate,
            authenticateUser : authenticateUser,
            identity : identity
        };

        function isIdentityResolved() {
            return angular.isDefined(_identity);
        }

        function isAuthenticated() {
            return _authenticated;
        }

        function isInRole(role) {
            if (!_authenticated || !_identity.roles)
                return false;

            return _identity.roles.indexOf(role) != -1;
        }

        function isInAnyRole(roles) {
            if (!_authenticated || !_identity.roles)
                return false;

            for (var i = 0; i < roles.length; i++) {
                if (this.isInRole(roles[i]))
                    return true;
            }

            return false;
        }

        function authenticate(identity) {
            _identity = identity;
            _authenticated = identity != null;

            // for this demo, we'll store the identity in localStorage. For you, it could be a cookie, localStorage, whatever
            if (identity)
                localStorage.setItem("cms.user_details", angular.toJson(identity));
            else
                localStorage.removeItem("cms.user_details");
        }

        function authenticateUser(postdata) {
            var deferred = $q.defer(), self = this;

            $http.post('Security', postdata).then(function(response) {
                if (!response.error && response.session_token) {
                    response.data.username = postdata.username;
                    response.data.roles = ['User'];
                    self.authenticate(response.data);
                    deferred.resolve(response.data);
                } else {
                    deferred.reject(response);
                }
            }, function(message) {
                deferred.reject(message);
            });
            return deferred.promise;
        }

        function identity(force) {
            var deferred = $q.defer();

            if (force === true)
                _identity = undefined;

            // check and see if we have retrieved the identity data from the server. if we have, reuse it by immediately resolving
            if (angular.isDefined(_identity)) {
                deferred.resolve(_identity);

                return deferred.promise;
            }

            //read the identity from localStorage.

            _identity = angular.fromJson(localStorage.getItem("cms.user_details"));
            this.authenticate(_identity);
            deferred.resolve(_identity);

            return deferred.promise;
        }

    }

})();

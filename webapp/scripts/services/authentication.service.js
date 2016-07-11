(function() {"use strict";
    /**
     * @ngdoc service
     * @name cmsWebApp.service:AuthenticationService
     * @description
     * Authentication is a service that tracks the user's identity.
     * calling identity() returns a promise while it does what you need it to do
     * to look up the signed-in user's identity info. for example, it could make an
     * HTTP request to a rest endpoint which returns the user's name, roles, etc.
     * after validating an auth token in a session storage. it will only do this identity lookup
     * once, when the application first runs. you can force re-request it by calling identity(true)
     * Reference: http://stackoverflow.com/a/26201288
     */
    angular.module('cmsWebApp').service('AuthenticationService', AuthenticationService);

    /*Inject angular services*/
    AuthenticationService.$inject = ['$q', '$http', 'WS'];

    function AuthenticationService($q, $http, WS) {
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
        
        /**
         * @ngdoc method
         * @name isIdentityResolved
         * @methodOf cmsWebApp.service:AuthenticationService
         * @description
         * Checks whether user details object ie.,_identity is already defined 
         * @returns {Boolean} boolean returns true/false 
         */
        function isIdentityResolved() {
            return angular.isDefined(_identity);
        }
        
        /**
         * @ngdoc method
         * @name isAuthenticated
         * @methodOf cmsWebApp.service:AuthenticationService
         * @description
         * Checks whether user is Authenticated 
         * @returns {Boolean} boolean returns true/false
         */
        function isAuthenticated() {
            return _authenticated;
        }
        
        /**
         * @ngdoc method
         * @name isInRole
         * @methodOf cmsWebApp.service:AuthenticationService
         * @param {String} role role of user
         * @description
         * Validated the user role 
         * @returns {Boolean} boolean returns true/false
         */
        function isInRole(role) {
            if (!_authenticated || !_identity.roles)
                return false;

            return _identity.roles.indexOf(role) != -1;
        }

        /**
         * @ngdoc method
         * @name isInAnyRole
         * @methodOf cmsWebApp.service:AuthenticationService
         * @param {Array} roles user roles in array 
         * @description
         * Validated atleast one role is available in array of roles 
         * @returns {Boolean} boolean returns true/false
         */
        function isInAnyRole(roles) {
            if (!_authenticated || !_identity.roles)
                return false;

            for (var i = 0; i < roles.length; i++) {
                if (this.isInRole(roles[i]))
                    return true;
            }

            return false;
        }
        
        /**
         * @ngdoc method
         * @name authenticate
         * @methodOf cmsWebApp.service:AuthenticationService
         * @param {Object} identity user details object, null is used for logout
         * @description
         * Add the userdetails to local storage or delete user details from local storage.
         * if identity param has userdetails the save details required for login/authenticate.
         * otherwise if identity is null remove use details and make user unauthenticate.
         */
        function authenticate(identity) {
            _identity = identity;
            _authenticated = identity != null;

            // for this demo, we'll store the identity in localStorage. For you, it could be a cookie, localStorage, whatever
            if (identity)
                localStorage.setItem("cms.user_details", angular.toJson(identity));
            else
                localStorage.removeItem("cms.user_details");
        }

        /**
         * @ngdoc method
         * @name authenticateUser
         * @methodOf cmsWebApp.service:AuthenticationService
         * @param {Object} postdata postdata with username & password required for service for authentication
         * @description
         * Execute the service call & based on reponse authenticate user. 
         * @returns {Object} promise is resolved if user authenticated or reject the promise with error message
         */
        function authenticateUser(postdata) {
            var deferred = $q.defer(), self = this;

            $http.post(WS.authenticateUser, postdata).then(function (response) {
                if (response.data && response.data.authToken) {
                    response.data.roles = ['User'];
                    response.data.userSession = response.data.authToken.substring(1, 4) + Math.floor((Math.random() * 1000) + 1);
                    self.authenticate(response.data);
                    deferred.resolve(response.data);
                } else {
                    //{"responseCode":"401","message":"User/Pass incorrect"}
                    deferred.reject(response);
                }
            }, function(message) {
                deferred.reject(message);
            });
            return deferred.promise;
        }

        /**
         * @ngdoc method
         * @name identity
         * @methodOf cmsWebApp.service:AuthenticationService
         * @param {Boolean} force force to check the user details from local storage
         * @description
         * To check whether is already authenticated. check and see if we have retrieved the user details data from the server.
         * force is not true then  
         * if we have, reuse it by immediately resolving.
         * if force is true then if we have data also check from local storage.
         * @returns {Object} promise is resolve with user details
         */
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

(function() {"use strict";
    /**
     * @ngdoc controller
     * @name cmsWebApp.controller:LoginController
     * @description 
     * LoginController authenticate the users.
     */
    angular.module('cmsWebApp').controller('LoginController', LoginController);

    /*Inject angular services to controller*/
    LoginController.$inject = ['$rootScope', '$scope', '$state', 'AuthenticationService'];

    /*Function LoginController*/
    function LoginController($rootScope, $scope, $state, AuthenticationService) {
        var auth = this;

        auth.validateUser = validateUser;

        /**
         * @ngdoc method
         * @name validateUser
         * @methodOf cmsWebApp.controller:LoginController
         * @description
         * When login button clicked, check & validate username & password before authenicating
         */
        function validateUser() {
            if (auth.username.trim() !== "" || auth.password.trim() !== "") {
                $rootScope.setLoading(true);
                AuthenticationService.authenticateUser({
                    username : auth.username.trim(),
                    password : auth.password.trim()
                }).then(function() {
                    $state.go('dashboard');
                }, function(failResponse) {
                    auth.message = (failResponse && failResponse.data && failResponse.data.message)? failResponse.data.message : "Invalid username/password!";
                    $rootScope.setLoading(false);
                });
                //$state.go('dashboard');
            } else {
                auth.message = "Invalid username/password!";
            }
        }

    }

})();

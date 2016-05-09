/**
 * Controller Name: AuthenticationController
 * Desc: AuthenticationController authenticate the users.
 *
 **/

(function() {"use strict";
    angular.module('cmsWebApp').controller('AuthenticationController', AuthenticationController);

    /*Inject angular services to controller*/
    AuthenticationController.$inject = ['$rootScope', '$scope', '$state', 'AuthenticationService'];

    /*Function AuthenticationController*/
    function AuthenticationController($rootScope, $scope, $state, AuthenticationService) {
        var auth = this;

        /*TODO: add validation & format code*/
        auth.validateUser = validateUser;

        
        function validateUser() {

            if (auth.username.trim() !== "" || auth.password.trim() !== "") {
                $rootScope.setLoading(true);
                AuthenticationService.authenticateUser({
                    username : $scope.username,
                    password : $scope.password
                }).then(function() {
                    $state.go('dashboard');
                }, function() {
                    auth.message = "Invalid username/password!";
                    $rootScope.setLoading(false);
                    $state.go('login');
                });
                //$state.go('dashboard');
            } else {
                auth.message = "Invalid username/password!";
            }
        }

    }

})();

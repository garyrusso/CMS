/**
 * Controller Name: LoginController
 * Desc: LoginController authenticate the users.
 *
 **/

(function() {"use strict";
    angular.module('cmsWebApp').controller('LoginController', LoginController);

    /*Inject angular services to controller*/
    LoginController.$inject = ['$rootScope', '$scope', '$state', 'AuthenticationService'];

    /*Function LoginController*/
    function LoginController($rootScope, $scope, $state, AuthenticationService) {
        var auth = this;

        /*TODO: add validation & format code*/
        auth.validateUser = validateUser;

        
        function validateUser() {
            if (auth.username.trim() !== "" || auth.password.trim() !== "") {
                $rootScope.setLoading(true);
                AuthenticationService.authenticateUser({
                    username : auth.username.trim(),
                    password : auth.password.trim()
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

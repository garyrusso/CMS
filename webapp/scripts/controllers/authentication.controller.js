/**
 * Controller Name: AuthenticationController
 * Desc: AuthenticationController authenticate the users.
 *
 **/

(function() {"use strict";
    angular.module('cmsWebApp').controller('AuthenticationController', AuthenticationController);

    /*Inject angular services to controller*/
    AuthenticationController.$inject = ['$scope','$state'];

    /*Function AuthenticationController*/
    function AuthenticationController($scope,$state) {
        var auth = this;
        
        /*TODO: add validation & format code*/
        auth.validateUser = function () {

            if ($scope.username == "TechM@techm.com" || $scope.password == "TechM") {
                $state.go('dashboard');
            }
            else {
                $scope.message = "Invalid username/password!";
            }
        };


    }

})();

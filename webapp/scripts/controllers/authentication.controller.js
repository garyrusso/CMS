/**
 * Controller Name: AuthenticationController
 * Desc: AuthenticationController authenticate the users.
 *
 **/

(function() {"use strict";
    angular.module('cmsWebApp').controller('AuthenticationController', AuthenticationController);

    /*Inject angular services to controller*/
    AuthenticationController.$inject = ['$state'];

    /*Function AuthenticationController*/
    function AuthenticationController($state) {
        var auth = this;
        
        auth.validateUser = function(){
            $state.go('dashboard');
        }
    }

})();

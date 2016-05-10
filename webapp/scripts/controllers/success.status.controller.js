/**
 * Controller Name: SuccessStatusController
 * Desc: SuccessStatusController 
 *
 **/

(function() {"use strict";
    angular.module('cmsWebApp').controller('SuccessStatusController', SuccessStatusController);

    /*Inject angular services to controller*/
    SuccessStatusController.$inject = ['$state', '$stateParams', '$log'];

    /*Function SuccessStatusController*/
    function SuccessStatusController($state, $stateParams, $log) {
        $log.debug('SuccessStatusController'+$stateParams);
        var ss = this;
        
        ss.data = angular.copy($stateParams);
    }

})();

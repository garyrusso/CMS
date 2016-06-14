(function() {"use strict";
    /**
     * @ngdoc controller
     * @name cmsWebApp.controller:SuccessStatusController
     * @description 
     * SuccessStatusController is the controller to manage success page when project/content edited/added/delted  
     **/
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

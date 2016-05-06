/*
 * @description
 *  enable angular-mocks based on environment. 
 */
(function() {"use strict";
    angular.module('cmsWebApp').config(MockConfig);

    MockConfig.$inject = ['APP_CONFIG', '$provide'];

    function MockConfig(APP_CONFIG, $provide) {
        //Only load mock data, if config says so
        if (!APP_CONFIG.API[APP_CONFIG.environment].useMocks) {
            return;
        }
        //$log.debug('Mock service is enabled');
        //Decorate backend with awesomesauce
        $provide.decorator('$httpBackend', angular.mock.e2e.$httpBackendDecorator);
    }

})();

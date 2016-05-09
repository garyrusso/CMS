/*
 * @description
 *  Enable/Disable log debug mode, print the logs when debug mode is true in configuration
 * @example
 * $log.debug('....');
 * 
 */
(function() {"use strict";
    angular.module('cmsWebApp').config(LogProviderConfig);

    LogProviderConfig.$inject = ['APP_CONFIG', '$logProvider'];

    function LogProviderConfig(APP_CONFIG, $logProvider) {
        $logProvider.debugEnabled(APP_CONFIG.API[APP_CONFIG.environment].debug);
    }

})();
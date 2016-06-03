/*
 * @ngdoc object
 * @name WS
 * @description
 * All webservices are listed here
 * @example
 * WS is injectable as constant (as a service even to .config())
 * <pre>
 * (...)    .config(function (WS) {
 * </pre>
 */

(function() {"use strict";
    angular.module('cmsWebApp').constant('WS', {
        'authenticateUser' : 'Security/ValidateUserCredentials',
        'getDictionary' : 'dictionary/GetDictionary'
    });
})();

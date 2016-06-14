/**
 * @ngdoc overview
 * @name cms-underscore
 * @description 
 * Global variable _ is assign to angular module.
 * Often when writing AngularJS apps there will be a dependency on an object that binds itself to the global scope. This means it's available in any AngularJS code, but this breaks the dependency injection model and leads to a few issues, especially in testing.
 * AngularJS makes it simple to encapsulate these globals into modules so they can be injected like standard AngularJS modules.
 */ 
(function() {"use strict";;
    angular.module('cms-underscore', []).factory('_', function() {
        return window._;
        //Underscore must already be loaded on the page
    });
})();

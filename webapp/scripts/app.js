(function() {'use strict';
    /**
     * @ngdoc overview
     * @name cmsWebApp
     * @description
     * The goal of this project is to build a Content Management System for managing course
     * content thus enable nearsimultaneous publishing course content in Print and Digital format.
     * The project is scoped to build a content repository,
     * ensuring compliance with Macmillan Learning’s technology stack.
     */
    angular.module('cmsWebApp', ['ui.router', 'ui.bootstrap', 'cms-underscore', 'ngTable', 'ngSanitize', 'ui.select']);
})(); 
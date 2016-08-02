(function() {"use strict";
    /**
     * @ngdoc directive
     * @name cmsWebApp.directive:projectDuplicateCheck
     * @description
     * Check whether the project is exisit already to avoid duplicate project creation.
     */
    angular.module('cmsWebApp').directive('projectDuplicateCheck', projectDuplicateCheck);

    /*Inject angular services to controller*/
    projectDuplicateCheck.$inject = ['$log', '$q', 'ManageProjectsService'];

    /*Function projectDuplicateCheck*/
    function projectDuplicateCheck($log, $q, ManageProjectsService) {
        return {
            require : 'ngModel',
            link : function($scope, element, attrs, ngModel) {
                ngModel.$asyncValidators.projectDuplicate = function(project) {
                    var defer = $q.defer();

                    ManageProjectsService.getProjects('*' + project + '*').then(function(response) {
                       var existingTitles = _.map(response.result, function(projectArray) {
                             return projectArray.title.toLowerCase();                           
                        });
                        var titleCopy = (attrs && attrs.titleCopy)? attrs.titleCopy.toLowerCase() : '';
                        existingTitles = _.without(existingTitles, attrs.titleCopy); 
                        if (existingTitles && project && _.contains(existingTitles, project.toLowerCase())) {
                            defer.reject('');
                        } else {
                            defer.resolve('');
                        }
                    });

                    return defer.promise;
                };

            }
        };
    }

})();

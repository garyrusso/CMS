/**
 * Controller Name: ModalCreateEditProjectController
 * Desc: ModalCreateEditProjectController to manage edit/create project.
 *
 **/

(function() {"use strict";
	angular.module('cmsWebApp').controller('ModalCreateEditProjectController', ModalCreateEditProjectController);

	/*Inject angular services to controller*/
	ModalCreateEditProjectController.$inject = ['$scope', '$uibModalInstance', 'items', 'getProjectMasterData', '_', '$filter', 'CommonService'];

	/*Function ModalCreateEditProjectController*/
	function ModalCreateEditProjectController($scope, $uibModalInstance, items, getProjectMasterData, _, $filter, CommonService) {
		$scope.items = items;

		if (items.edit) {
			$scope.data = items.data;

		} else {
			$scope.data = {
				"Title" : "",
				"Description" : "",
				"ProjectState" : "",
				"SubjectHeadings" : [],
				"SubjectKeywords" : [""]
			};
		}

		$scope.cancel = closeModalProject;

		function closeModalProject() {
			$uibModalInstance.dismiss('cancel');
		}

		/*Project state dropdown*/
		$scope.projectStates = getProjectMasterData.results;
		//["In Progress", "Active", "Completed","Inactive"];

		/*Project Subject dropdown */
		$scope.subjects = ["Psychology", "Economics", "History", "Biology"];

		/*$scope.selectedSubjects = _.chain($scope.subjects).indexBy('subjectHeading').mapObject(function(val, key) {
		 return {selected: _.contains(_.pluck($scope.data.subjectHeadings), key)};
		 }).value();*/

		$scope.statuses = $scope.subjects;
		$scope.selectedStatuses = $scope.data.SubjectHeadings;

		$scope.addKeywordField = addKeywordField;

		/* Create/Update Proejct submit function*/
		//TODO format
		$scope.submit = function() {
			/*$scope.data.dateLastModified = $filter('date')(_.now(), "yyyy-MM-dd hh:mm");*/
			/*var returnData = {
			 "Title": $scope.data.Title,
			 "Description" : $scope.data.description,
			 "ProjectState": $scope.data.projectState,
			 "SubjectHeadings": _.map($scope.data.subjectHeadings, function(eachHeading){
			 return eachHeading.subjectHeading;
			 }),
			 "SubjectKeywords": _.map($scope.data.subjectKeywords, function(eachKeyword){
			 return eachKeyword.subjectKeyword;
			 }),
			 "CreatedBy": $scope.data.createdBy,
			 "ModifiedBy": $scope.data.modifiedBy,
			 "DateCreated": $scope.data.dateCreated,
			 "DateModified": $scope.data.dateLastModified
			 };*/
			if (!items.edit) {
				/*$scope.data.dateCreated = $filter('date')(_.now(), "yyyy-MM-dd hh:mm");*/
				$scope.data.CreatedBy = CommonService.getItems('username');
				/*returnData.CreatedBy = CommonService.getItems('username');*/
			} else {
				$scope.data.ModifiedBy = CommonService.getItems('username');
			}

			$uibModalInstance.close(angular.copy($scope.data));
		};

		/*Dyanmic Keyword textbox*/

		function addKeywordField(keyword, $event) {
			keyword.push('');
			$event.preventDefault();
		}

	}

})();

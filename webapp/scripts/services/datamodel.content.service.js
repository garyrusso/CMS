/**
 * @ngdoc service
 * @name cmsWebApp.service:DataModelContentService
 * @description
 * DataModelContentService DataModel for content.
 */

(function() {"use strict";
    angular.module('cmsWebApp').factory('DataModelContentService', DataModelContentService);

    /*Inject angular services*/
    DataModelContentService.$inject = ['_'];

    function DataModelContentService(_) {
        
        function contentModel(contentData) {
            var ContentUri = '', 
                Title = '', 
                Description = '', 
                Source = '', 
                Creator = [''], 
                Publisher = '', 
                ContentState = '', 
                Projects = [''], 
                SubjectHeadings = [], 
                SubjectKeywords = [''], 
                SystemId = '', 
                DateCreated = '', 
                DateModified = '', 
                CreatedBy = '', 
                ModifiedBy = '', 
                DatePublished = '', 
                ContentResourceType = '', 
                FileFormat = '', 
                FileName = '', 
                FileSize = '', 
                FilePath = '';
            if(contentData) {
                this.setContent(contentData);
            }
        }
        contentModel.prototype = {
            setContent: function(contentData){
                this.ContentUri = contentData.uri;
                this.Title = contentData.Title;
                this.Description = contentData.description;
                this.Source = contentData.source;
                this.Creator = _.pluck(contentData.creators, 'creator');
                this.Publisher = contentData.publisher; 
                this.ContentState = contentData.contentState; 
                this.Projects = contentData.projects; 
                this.SubjectHeadings = _.pluck(contentData.subjectHeadings, 'subjectHeading'); 
                this.SubjectKeywords = _.pluck(contentData.subjectKeywords, 'subjectKeyword'); 
                this.SystemId = contentData.systemUID; 
                this.DateCreated = contentData.dateCreated; 
                this.DateModified = contentData.dateLastModified; 
                this.CreatedBy = contentData.createdBy; 
                this.ModifiedBy = contentData.modifiedBy; 
                this.DatePublished = contentData.datePublished; 
                this.ContentResourceType = contentData.contentResourceType; 
                this.FileFormat = contentData.format; 
                this.FileName = contentData.fileName; 
                this.FileSize = contentData.fileSize; 
                this.FilePath = contentData.filePath;
                
                if((this.Creator && this.Creator.length === 0) || !this.Creator ) {
                    this.Creator = [''];
                }
                if((this.Projects && this.Projects.length === 0) || !this.Projects ) {
                    this.Projects = [''];
                }
                if((this.SubjectKeywords && this.SubjectKeywords.length === 0) || !this.SubjectKeywords ) {
                    this.SubjectKeywords = [''];
                }
            },
            getContent: function() {
                return this;
            }
        };
        return contentModel;
    }

})();

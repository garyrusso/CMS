(function() {"use strict";
    /**
     * @ngdoc service
     * @name cmsWebApp.service:DataModelContentService
     * @description
     * DataModelContentService DataModel for content.
     */
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
            setContent: setContent,
            getContent: getContent
        };
        return contentModel;
        
        /**
         * @ngdoc method
         * @name setContent
         * @methodOf cmsWebApp.service:DataModelContentService 
         * @param {Object} contentData contentData object
         * @description
         * set the content data.
         */
        function setContent (contentData) {
            this.ContentUri = contentData.contentUri;
            this.Title = contentData.title;
            this.Description = contentData.description;
            this.Source = contentData.source;
            this.Creator = contentData.creator;
            this.Publisher = contentData.publisher; 
            this.ContentState = contentData.contentState; 
            this.Projects = contentData.projects; 
            this.SubjectHeadings = contentData.subjectHeading; 
            this.SubjectKeywords = contentData.subjectKeyword; 
            this.SystemId = contentData.systemId; 
            this.DateCreated = contentData.created;
            this.DateModified = contentData.modified;
            this.CreatedBy = contentData.createdBy; 
            this.ModifiedBy = contentData.modifiedBy; 
            this.DatePublished = contentData.datePublished; 
            this.ContentResourceType = contentData.contentResourceType; 
            this.FileFormat = contentData.FileFormat; 
            this.FileName = contentData.FileName; 
            this.FileSize = contentData.fileSize; 
            this.FilePath = contentData.FilePath;
            this.AuditInfo = contentData.auditInfo;
                        
            if((this.Creator && this.Creator.length === 0) || !this.Creator ) {
                this.Creator = [''];
            }
            if((this.Projects && this.Projects.length === 0) || !this.Projects ) {
                this.Projects = [''];
            }
            if((this.SubjectKeywords && this.SubjectKeywords.length === 0) || !this.SubjectKeywords ) {
                this.SubjectKeywords = [''];
            }
        }
        
        /**
         * @ngdoc method
         * @name getContent
         * @methodOf cmsWebApp.service:DataModelContentService
         * @description
         * get the content data.
         * @returns {Object} content data object
         */
        function getContent () {
            return this;
        }
    }

})();

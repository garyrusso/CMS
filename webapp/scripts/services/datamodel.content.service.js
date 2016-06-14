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
            setContent: function(contentData){
                this.ContentUri = contentData.ContentUri;
                this.Title = contentData.Title;
                this.Description = contentData.Description;
                this.Source = contentData.Source;
                this.Creator = contentData.Creator;
                this.Publisher = contentData.Publisher; 
                this.ContentState = contentData.ContentState; 
                this.Projects = contentData.Projects; 
                this.SubjectHeadings = contentData.SubjectHeadings; 
                this.SubjectKeywords = contentData.SubjectKeywords; 
                this.SystemId = contentData.SystemId; 
                this.DateCreated = contentData.DateCreated; 
                this.DateModified = contentData.DateModified; 
                this.CreatedBy = contentData.CreatedBy; 
                this.ModifiedBy = contentData.ModifiedBy; 
                this.DatePublished = contentData.DatePublished; 
                this.ContentResourceType = contentData.ContentResourceType; 
                this.FileFormat = contentData.FileFormat; 
                this.FileName = contentData.FileName; 
                this.FileSize = contentData.FileSize; 
                this.FilePath = contentData.FilePath;
                this.AuditInfo = contentData.AuditInfo;
                
                
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

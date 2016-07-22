//-------------------------------------------------------------------------
// <copyright file="ManageProjectsController.cs" company="Macmillan">
//     Macmillan Learning. All rights reserved.
// </copyright>
// <author>TechM</author>
//-------------------------------------------------------------------------
// <summary>
// This file holds Manage Projects Controller class
// </summary>

namespace Macmillan.CMS.Service.Controllers
{
    using Macmillan.CMS.Business;
    using Macmillan.CMS.Common;
    using Macmillan.CMS.Common.Logging;
    using Macmillan.CMS.Common.Models;
    using Macmillan.CMS.Service.Filters;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Web.Http;

    /// <summary>
    /// This controller hosts all the manage project related functionalities.
    /// </summary>
    [Authentication]
    [ManageException]
    public class ManageProjectsController : ApiController
    {
        IManageProjectBusiness business;
        /// <summary>
        /// Initializes a new instance of the <see cref="<ManageProjectsController>"/> class.
        /// </summary>
        /// <param name="manageProjectBusiness"></param>
        public ManageProjectsController(IManageProjectBusiness manageProjectBusiness)
        { 
            this.business = manageProjectBusiness;
        }

        /// <summary>
        /// GetProject with given details
        /// </summary>
        /// <returns></returns>
        public string GetProject()
        {
            Logger.Info("Entering the GetProject");
            string results = string.Empty;

            Project p = new Project();

            p.Title = "test title";
            p.Description = "test description";
            p.ProjectState = "in progress";
            p.SubjectHeadings = new string[] { "test1", "test2", "test3"};
            p.SubjectKeywords = new string[] { "kw1", "kw2", "kw3" };
            p.CreatedBy = "test@admin.com";
            JsonNetSerialization ser = new JsonNetSerialization();
            Logger.Debug(" Logging Results for GetProject");
            results = ser.Serialize<Project>(p);
            Logger.Info("Exiting the GetProject");
            return results;
        }

        /// <summary>
        /// CreateProject with given details
        /// </summary>
        /// <param name="request"></param>
        /// <param name="project"></param>
        /// <returns></returns>
        [HttpPost]
        public object CreateProject(HttpRequestMessage request,
            [FromBody]Project project)
        {
            Logger.Info("Entering CreateProject");
            Logger.Debug("Logging Results for CreateProject");
            var results = this.business.CreateProject(project);
            Logger.Info("Exiting CreateProject");
            return results;
        }
               
        /// <summary>
        /// UpdateProject with given details
        /// </summary>
        /// <param name="project"></param>
        /// <returns></returns>
        [HttpPut]
        public object UpdateProject(Project project)
        {
            Logger.Info("Entering UpdateProject");
            Logger.Debug("Logging Results for UpdateProject");
            var results = this.business.UpdateProject(project);
            Logger.Info("Exiting UpdateProject");
            return results;
        }
       
        /// <summary>
        /// DeleteProject with given details
        /// </summary>
        /// <param name="request"></param>
        /// <param name="project"></param>
        /// <returns></returns>
        [HttpPost]
        public object DeleteProject(HttpRequestMessage request,
            [FromBody] Project project)
        {
            Logger.Info("Entering DeleteProject");
            Logger.Debug("Logging Results for DeleteProject");
            var results = this.business.DeleteProject(project);
            Logger.Info("Exiting DeleteProject");
            return results;
        }

        /// <summary>
        /// GetProjectDetails with given details
        /// </summary>
        /// <param name="uri"></param>
        /// <returns></returns>
        [HttpGet]
        public object GetProjectDetails(string uri)
        {
            Logger.Info("Entering GetProjectDetails");
            Logger.Debug("Logging Results for GetProjectDetails");
            var results= this.business.GetProjectDetails(uri);
            Logger.Info("Exiting GetProjectDetails");
            return results;
  
        }
        
        /// <summary>
        /// GetProjectMasterData with given details
        /// </summary>
        /// <param name="ProjectDetail"></param>
        /// <returns></returns>
        public object GetProjectMasterData(List<Project> ProjectDetail)
        {
            Logger.Info("Entering GetProjectMasterData");
            Logger.Debug("Logging Results for GetProjectDetails");
            var results= this.business.GetProjectMasterData(ProjectDetail);
            Logger.Info("Exiting GetProjectMasterData");
            return results;
        }
        
        /// <summary>
        /// SearchProjects with given details
        /// </summary>
        /// <param name="searchText"></param>
        /// <param name="pageNumber"></param>
        /// <param name="pageSize"></param>
        /// <param name="orderBy"></param>
        /// <returns></returns>
        [HttpGet]
        public object SearchProjects(string searchText, int pageNumber, int pageSize, string orderBy)
        {
            Logger.Info("Entering SearchProjects");
            Logger.Debug("Logging Results for GetProjectDetails");
            var results= this.business.SearchProjects(searchText, pageNumber, pageSize, orderBy);
            Logger.Info("Exiting SearchProjects");
            return results;
        }
    }
}

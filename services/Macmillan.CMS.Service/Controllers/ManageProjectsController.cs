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

        public ManageProjectsController(IManageProjectBusiness manageProjectBusiness)
        { 
            this.business = manageProjectBusiness;
        }  

        /// <summary>
        /// CreateProject with given details
        /// </summary>
        /// <param name="request"></param>
        /// <param name="project"></param>
        /// <returns></returns>
        [HttpPost]
        public object CreateProject(HttpRequestMessage request,
            [FromBody] Project project)
        {
            Logger.Debug("Entering CreateProject");
            var results = this.business.CreateProject(project);
            Logger.Debug("Exiting CreateProject");
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
            Logger.Debug("Entering UpdateProject");         
            var results= this.business.UpdateProject(project);
            Logger.Debug("Exiting UpdateProject");
            return results;
        }
       
        /// <summary>
        /// DeleteProject with given details
        /// </summary>
        /// <param name="request"></param>
        /// <param name="project"></param>
        /// <returns></returns>
        [HttpDelete]
        public object DeleteProject(HttpRequestMessage request,
            [FromBody] Project project)
        {
            Logger.Debug("Entering DeleteProject");
            var results= this.business.DeleteProject(project);
            Logger.Debug("Exiting DeleteProject");
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
            Logger.Debug("Entering GetProjectDetails");          
            var results= this.business.GetProjectDetails(uri);
            Logger.Debug("Exiting GetProjectDetails");
            return results;
  
        }
        
        /// <summary>
        /// GetProjectMasterData with given details
        /// </summary>
        /// <param name="ProjectDetail"></param>
        /// <returns></returns>
        public object GetProjectMasterData(List<Project> ProjectDetail)
        {
            Logger.Debug("Entering GetProjectMasterData");
            var results= this.business.GetProjectMasterData(ProjectDetail);
            Logger.Debug("Exiting GetProjectMasterData");
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
            Logger.Debug("Entering SearchProjects");     
            var results= this.business.SearchProjects(searchText, pageNumber, pageSize, orderBy);
            Logger.Debug("Exiting SearchProjects");
            return results;
        }
    }
}

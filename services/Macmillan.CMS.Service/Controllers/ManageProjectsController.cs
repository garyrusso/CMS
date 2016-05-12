﻿//-------------------------------------------------------------------------
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
            Logger.Debug("Entry CreateProject");
            Logger.Debug("Exit CreateProject");
            return this.business.CreateProject(project);
        }
               
        /// <summary>
        /// UpdateProject with given details
        /// </summary>
        /// <param name="project"></param>
        /// <returns></returns>
        [HttpPut]
        public object UpdateProject(Project project)
        {
            Logger.Debug("Entry UpdateProject");
            Logger.Debug("Exit UpdateProject");
            return this.business.UpdateProject(project);
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
            Logger.Debug("Entry DeleteProject");
            Logger.Debug("Exit DeleteProject");
            return this.business.DeleteProject(project);          
        }

        /// <summary>
        /// GetProjectDetails with given details
        /// </summary>
        /// <param name="uri"></param>
        /// <returns></returns>
        [HttpGet]
        public object GetProjectDetails(string uri)
        {
            Logger.Debug("Entry GetProjectDetails");
            Logger.Debug("Exit GetProjectDetails");
            return this.business.GetProjectDetails(uri);
  
        }
        
        /// <summary>
        /// GetProjectMasterData with given details
        /// </summary>
        /// <param name="ProjectDetail"></param>
        /// <returns></returns>
        public object GetProjectMasterData(List<Project> ProjectDetail)
        {
            Logger.Debug("Entry GetProjectMasterData");
            Logger.Debug("Exit GetProjectMasterData");
            return this.business.GetProjectMasterData(ProjectDetail);
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
            Logger.Debug("Entry SearchProjects");
            Logger.Debug("Exit SearchProjects");
            return this.business.SearchProjects(searchText, pageNumber, pageSize, orderBy);
        }
    }
}

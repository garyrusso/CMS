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

        /// Creates project
        [HttpPost]
        public object CreateProject(HttpRequestMessage request,
            [FromBody] Project project)
        {
            Logger.Debug("Entry CreateProject");
            return this.business.CreateProject(project);
        }
               
        ///Updates project
        [HttpPut]
        public object UpdateProject(Project project)
        {
            Logger.Debug("Entry UpdateProject");
            return this.business.UpdateProject(project);
        }
       
        ///Delete project
        [HttpDelete]
        public object DeleteProject(HttpRequestMessage request,
            [FromBody] Project project)
        {
            Logger.Debug("Entry DeleteProject");
            return this.business.DeleteProject(project);          
        }
        ///GetProjectDetails

        [HttpGet]
        public object GetProjectDetails(string uri)
        {
            Logger.Debug("Entry GetProjectDetails");
            return this.business.GetProjectDetails(uri);
        }
        ///Get ProjectMasterData
        public object GetProjectMasterData(List<Project> ProjectDetail)
        {
            Logger.Debug("Entry GetProjectMasterData");
            return this.business.GetProjectMasterData(ProjectDetail);
        }
        ///Get SearchProjects
        [HttpGet]
        public object SearchProjects(string searchText, int pageNumber, int pageSize, string orderBy)
        {
            Logger.Debug("Entry SearchProjects");
            return this.business.SearchProjects(searchText, pageNumber, pageSize, orderBy);
        }
    }
}

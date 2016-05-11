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
            return this.business.CreateProject(project);
        }
               
        ///Updates project
        public object UpdateProject(Project project)
        {
            return this.business.UpdateProject(project);
        }
       
        ///Delete project
        public object DeleteProject(Project project)
        {
            return this.business.DeleteProject(project);
        }
         [HttpGet]
        public object GetProjectDetails(int projectId)
        {
            return this.business.GetProjectDetails(projectId);
        }

        public object GetProjectMasterData(string type)
        {
            return this.business.GetProjectMasterData(type);
        }

        public object SearchProjects(string searchText, int pageNumber, int pageSize, string orderBy)
        {
            return this.business.SearchProjects(searchText, pageNumber, pageSize, orderBy);
        }
    }
}

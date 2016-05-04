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

        public object CreateProject(Project project)
        {
            return this.business.CreateProject(project);
        }
    }
}

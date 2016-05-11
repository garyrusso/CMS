﻿namespace Macmillan.CMS.Service.Controllers
{
    using Macmillan.CMS.Business;
    using Macmillan.CMS.Common;
    using Macmillan.CMS.Common.Logging;
    using Macmillan.CMS.Common.Models;
    using Macmillan.CMS.DAL;
    using Macmillan.CMS.Service.Filters;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Web.Http;

    /// <summary>
    /// Hosts all authentication\authorization and other security (if any) related functionalities.
    /// </summary>
    [ManageException]
    public class SecurityController : ApiController
    {
        ISecurityBusiness secureBusiness;

        public SecurityController(ISecurityBusiness securityBusiness)
        {
            this.secureBusiness = securityBusiness;
        }              

        [HttpPost]
        public object ValidateUserCredentials(HttpRequestMessage request,   
            [FromBody] Authentication authentication)
        {     
            return this.secureBusiness.ValidateUserCredentials(authentication);
        }
    }
    
}

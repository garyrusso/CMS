namespace Macmillan.CMS.Service.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Web.Http;
    using Macmillan.CMS.Business;
    using Macmillan.CMS.Common;
    using Macmillan.CMS.Common.Logging;
    using Macmillan.CMS.Common.Models;
    using Macmillan.CMS.DAL;
    using Macmillan.CMS.Service.Filters;

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
       
        /// <summary>
        /// ValidateUserCredentials with given details
        /// </summary>
        /// <param name="request"></param>
        /// <param name="authentication"></param>
        /// <returns>Returns object for ValidateUserCredentials</returns>
        [HttpPost]
        public object ValidateUserCredentials(HttpRequestMessage request,   
            [FromBody] Authentication authentication)
        {
            Logger.Debug("Entering ValidateUserCredentials");
            var results= this.secureBusiness.ValidateUserCredentials(authentication);
            Logger.Debug("Exiting ValidateUserCredentials");
            return results;
        }
    }
    
}

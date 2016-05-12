namespace Macmillan.CMS.Service.Filters
{
    using System;
    using System.Collections.Generic;
    using System.Configuration;
    using System.Linq;
    using System.Net.Http;
    using System.Web;
    using System.Web.Http.Controllers;
    using System.Web.Http.Filters;
      
    public class AuthenticationAttribute : ActionFilterAttribute
    {        
        /// <summary>
        /// Fires on any exception in any controller
        /// </summary>
        /// <param name="actionContext"></param>
        public override void OnActionExecuting(HttpActionContext actionContext)
        {
            
        }
    }
}
using Macmillan.CMS.Business;
using Macmillan.CMS.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Macmillan.CMS.Service.Controllers
{
    public class AuthenticationController : ApiController
    {
        IAuthenticationBusiness AuthBusiness;

        public AuthenticationController(IAuthenticationBusiness AuthenticationBusiness)
        {
            this.AuthBusiness = AuthenticationBusiness;
        }

        [HttpGet]
        public object ValidateUserCredentials(Authentication Authentication)
        {
            return this.AuthBusiness.ValidateUserCredentials(Authentication);
        }
    }
}

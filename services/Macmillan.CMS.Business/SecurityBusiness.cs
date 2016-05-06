using Macmillan.CMS.Common;
using Macmillan.CMS.Common.Logging;
using Macmillan.CMS.Common.Models;
using Macmillan.CMS.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Macmillan.CMS.Business
{
    public class SecurityBusiness : ISecurityBusiness
    {
        ISecurityDAL securityDAL;
        public SecurityBusiness(ISecurityDAL securityDal)
        {
            this.securityDAL = securityDal;
        }

        public object GetUserData()
        {
            return this.securityDAL.GetUserData();
        }

        public object ValidateUserCredentials(Authentication Authentication)
        {
            //Build XML
            string AuthenticationXML = this.BuildauthenticationXML(Authentication);

            //Post it to MarkLogic
            return null;
        }

        public string BuildauthenticationXML(Authentication Authentication)
        {

            return null;
        }
    }
}

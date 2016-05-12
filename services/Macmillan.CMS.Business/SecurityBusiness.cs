
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Macmillan.CMS.Common;
using Macmillan.CMS.Common.Logging;
using Macmillan.CMS.Common.Models;
using Macmillan.CMS.DAL;

namespace Macmillan.CMS.Business
{
    /// <summary>
    /// Hosts all authentication\authorization and other security (if any) related functionalities.
    /// </summary>
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
        ///functionalities for ValidateUserCredentials
        public object ValidateUserCredentials(Authentication authentication)
        {
            ////Build XML
            //string AuthenticationXML = this.BuildauthenticationXML(Authentication);         
            ////Post it to MarkLogic     
            Logger.Debug("ValidateUserCredentials"); 
            return this.securityDAL.ValidateUserCredentials(authentication);
        }

        //public string BuildauthenticationXML(Authentication Authentication)
        //{
           
        //    return this.securityDAL.ValidateUserCredentials(Authentication);
        //}
    }
}

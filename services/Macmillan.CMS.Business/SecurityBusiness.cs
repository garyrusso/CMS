
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

        /// <summary>
        /// GetUserData with given details
        /// </summary>
        /// <returns></returns>
        public object GetUserData()
        {
            Logger.Debug("Entering ValidateUserCredentials");
            Logger.Debug("Exiting ValidateUserCredentials");
            return this.securityDAL.GetUserData();
        }
        
        /// <summary>
        /// ValidateUserCredentials with given details
        /// </summary>
        /// <param name="authentication"></param>
        /// <returns></returns>
        public object ValidateUserCredentials(Authentication authentication)
        {
            Logger.Debug("Entering ValidateUserCredentials"); 
            ////Build XML
            //string AuthenticationXML = this.BuildauthenticationXML(Authentication);         
            ////Post it to MarkLogic           
            return this.securityDAL.ValidateUserCredentials(authentication);
            Logger.Debug("Exiting ValidateUserCredentials");
        }
    }
}


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
            Logger.Info("Entering GetUserData");
            var results= this.securityDAL.GetUserData();
            Logger.Debug("Logging results for GetUserData in SecurityBusiness");
            Logger.Info("Exiting GetUserData");
            return results;
        }
        
        /// <summary>
        /// ValidateUserCredentials with given details
        /// </summary>
        /// <param name="authentication"></param>
        /// <returns></returns>
        public object ValidateUserCredentials(Authentication authentication)
        {
            Logger.Info("Entering ValidateUserCredentials");                   
            ////Post it to MarkLogic           
            var results = this.securityDAL.ValidateUser(authentication);
            Logger.Debug("Logging results for ValidateUserCredentials with authentication");
            Logger.Info("Exiting ValidateUserCredentials");

            return results;
        }
    }
}

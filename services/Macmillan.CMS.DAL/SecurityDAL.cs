
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using Macmillan.CMS.Common;
using Macmillan.CMS.Common.Models;
using Macmillan.CMS.Common.Logging;

namespace Macmillan.CMS.DAL
{
    public class SecurityDAL : ISecurityDAL
    {
        public SecurityDAL()
        { }
        /// <summary>
        /// get user data with given details
        /// </summary>
        /// <returns></returns>
        public object GetUserData()
        {
            Logger.Debug("Entering GetUserData");
            JsonNetSerialization ser = new JsonNetSerialization();
            string content = @"{ 'Name': 'Jon Smith', 'Address': { 'City': 'New York', 'State': 'NY' }, 'Age': 42 }";
            Logger.Debug("Exiting GetUserData");
            return ser.DeSerialize(content);
        }

        /// <summary>
        /// get project for given details
        /// </summary>
        /// <param name="uri"></param>
        /// <returns></returns>
        public Project GetProject(string uri)
        {
            Logger.Debug("Entering GetProject");
            //Call ML and GetProject
            MLReader mlReader = new MLReader();

            Project proj = mlReader.GetHttpContent<Project>("http://ML/Project?docUri=adf");
            Logger.Debug("Exiting GetProject");
            return proj;
        }

        /// <summary>
        /// ValidateUserCredentials with given details
        /// </summary>
        /// <param name="authentication"></param>
        /// <returns></returns>
        public object ValidateUserCredentials(Authentication authentication)
        {
            //Call ML and ValidateUserCredentials
            Logger.Debug("Entering ValidateUserCredentials");
            if (authentication.username == "admin@techm.com" && authentication.password == "password")
            {
                JsonNetSerialization ser = new JsonNetSerialization();
                string content = @"{'session_token':'ZTQyMjE4YTdhYTE3OTI4NTljdhYTU0ZTAyNjk2Mg',
                        'expires_in': 3600,
                        'token_type': 'bearer',
                        'scope': 'user'}";
                return ser.DeSerialize(content);
            }
            else
            {
                JsonNetSerialization ser = new JsonNetSerialization();
                string content = @"{'errors': [{
		                    'code': 'invalid_grant',
		                    'user_message': 'Invalid Authentication',
		                    'developer_message': 'Developers: Please review the system logs for more information',
		                    'info': []
	                    }],
	                    'data': []
                        }";
                Logger.Debug("Exiting ValidateUserCredentials");
                return ser.DeSerialize(content);
            }
        }

    }
}


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

        public object GetUserData()
        {
            JsonNetSerialization ser = new JsonNetSerialization();
            string content = @"{ 'Name': 'Jon Smith', 'Address': { 'City': 'New York', 'State': 'NY' }, 'Age': 42 }";
            return ser.DeSerialize(content);
        }

        public Project GetProject(string uri)
        {
            //Call ML and GetProject
            MLReader mlReader = new MLReader();

            Project proj = mlReader.GetHttpContent<Project>("http://ML/Project?docUri=adf");

            return proj;
        }

        public object ValidateUserCredentials(Authentication authentication)
        {
            //Call ML and ValidateUserCredentials
            Logger.Debug("Exit ValidateUserCredentials");
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
                return ser.DeSerialize(content);
            }
        }

    }
}

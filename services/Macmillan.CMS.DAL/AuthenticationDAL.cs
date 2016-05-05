using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Macmillan.CMS.DAL
{
    public class AuthenticationDAL : IAuthenticationDAL 
    {
        public AuthenticationDAL()
        {
        }

        public object ValidateUserCredentials(string UserName , string PassWord)
        {
            //Call ML and post the project xml
            return null;
        }
    }
}

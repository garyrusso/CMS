using Macmillan.CMS.Common;
using Macmillan.CMS.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Macmillan.CMS.DAL
{
    public interface ISecurityDAL
    {
        object GetUserData();
        object ValidateUserCredentials(Authentication authentication);
    }
}
    
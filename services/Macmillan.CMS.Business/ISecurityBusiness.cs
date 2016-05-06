using Macmillan.CMS.Common.Models;
using Macmillan.CMS.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Macmillan.CMS.Business
{
    public interface ISecurityBusiness
    {
        object GetUserData();
        object ValidateUserCredentials(Authentication Authentication);
    }
}

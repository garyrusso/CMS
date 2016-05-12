
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Macmillan.CMS.Common.Models;
using Macmillan.CMS.DAL;

namespace Macmillan.CMS.Business
{
    /// <summary>
    /// Hosts all authentication\authorization and other security (if any) related functionalities.
    /// </summary>
    public interface ISecurityBusiness
    {
        object GetUserData();
        object ValidateUserCredentials(Authentication authentication);
    }
}

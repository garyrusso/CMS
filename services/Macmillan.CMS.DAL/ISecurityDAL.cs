
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Macmillan.CMS.Common;
using Macmillan.CMS.Common.Models;
namespace Macmillan.CMS.DAL
{
    /// <summary>
    /// Interface for SecurityDAL Layer
    /// </summary>
    public interface ISecurityDAL
    {
        object GetUserData();
        object ValidateUserCredentials(Authentication authentication);
        object ValidateUser(Authentication authentication);
    }
}
    
using Macmillan.CMS.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Macmillan.CMS.Business
{
    public interface IManageProjectBusiness
    {
        object CreateProject(Project project);        
    }
}

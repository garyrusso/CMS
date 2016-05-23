
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Macmillan.CMS.Common.Models;

namespace Macmillan.CMS.Business
{
    /// <summary>
    /// Hosts all ManageProjects and other ManageProjects (if any) related functionalities.
    /// </summary>
    public interface IManageProjectBusiness
    {
        object CreateProject(string projXml, string projUri);
        object UpdateProject(string projXml, string projUri);
        object DeleteProject(string projXml, string projUri);
        object GetProjectDetails(string uri);
        object GetProjectMasterData(List<Project> ProjectDetail);
        object SearchProjects(string searchText, int pageNumber, int pageSize, string orderBy);
    }
}

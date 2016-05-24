
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
        object CreateProject(Project project);
        object UpdateProject(Project project);
        object DeleteProject(Project project);
        object GetProjectDetails(string uri);
        object GetProjectMasterData(List<Project> ProjectDetail);
        object SearchProjects(string searchText, int pageNumber, int pageSize, string orderBy);
    }
}

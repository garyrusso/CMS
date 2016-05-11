﻿using Macmillan.CMS.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Macmillan.CMS.DAL
{
    public interface IManageProjectDAL
    {
       object CreateProject(Project project);
       object UpdateProject(Project project);
       object DeleteProject(Project project);
       object GetProjectDetails(int projectId);
       object GetAllProjects(List<Project> ProjectDetail);
       object SearchProjects(string searchText, int pageNumber, int pageSize, string orderBy);
    }
}

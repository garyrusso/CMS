using Macmillan.CMS.Common.Models;
using Macmillan.CMS.DAL;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Macmillan.CMS.Business
{
    public class ManageProjectBusiness:IManageProjectBusiness
    {
        IManageProjectDAL dal;

        public ManageProjectBusiness(IManageProjectDAL manageProjectDAL)
        {
            this.dal = manageProjectDAL;
        }

        public object CreateProject(Project project)
        {
            //Build create project XML

            //string projectXML = this.BuildProjectXML(project);

            //Post it to MarkLogic  

            return this.dal.CreateProject(project);
        }

        private string BuildProjectXML(Project project)
        {
            string path = Assembly.GetEntryAssembly().Location + @"\AppData\CreateProject.xml";
            StringBuilder text = new StringBuilder(File.ReadAllText(path));
            //d41d8cd98f00b204e9800998ecf8427e
            //www.macmillan.com/workflow/projects/Hockenbury5e

            text.Replace("##systemId##", new Guid("dddddddddddddddddddddddddddddddd").ToString());
            text.Replace("##docUri##", ConfigurationSettings.AppSettings["MarkLogicURL"] + "/projects/" + project.Title);
            text.Replace("##createdby##", project.CreatedBy);
            text.Replace("##title##", project.Title);
            text.Replace("##subject##", project.Subject);
            text.Replace("##projectState##", project.State);

            StringBuilder keywords = new StringBuilder();

            foreach (string keyword in project.Keywords)
            {
                keywords.Append("<mml:subjectKeyword>" + keyword + "</mml:subjectKeyword>");
            }

            text.Replace("####keywords####", keywords.ToString());
            text.Replace("##createdby##", project.CreatedBy);

            return text.ToString();
        }

        public object UpdateProject(Project project)
        {
            return this.dal.UpdateProject(project);
        }

        public object DeleteProject(Project project)
        {
            return this.dal.DeleteProject(project);
        }

        public object GetProjectDetails(string uri)
        {
            return this.dal.GetProjectDetails(uri);
        }

        public object GetProjectMasterData(List<Project> ProjectDetail)
        {
            return this.dal.GetProjectMasterData(ProjectDetail);
        }
        public object SearchProjects(string searchText, int pageNumber, int pageSize, string orderBy)
        {
            return this.dal.SearchProjects(searchText, pageNumber, pageSize, orderBy);
        }
    }
}

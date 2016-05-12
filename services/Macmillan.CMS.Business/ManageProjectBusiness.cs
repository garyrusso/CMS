
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Macmillan.CMS.Common.Models;
using Macmillan.CMS.DAL;
using Newtonsoft.Json.Linq;
using Macmillan.CMS.Common.Logging;

namespace Macmillan.CMS.Business
{
    public class ManageProjectBusiness:IManageProjectBusiness
    {
        IManageProjectDAL dal;

        public ManageProjectBusiness(IManageProjectDAL manageProjectDAL)
        {
            this.dal = manageProjectDAL;
        }
        ///functionalities for CreateProject
        public object CreateProject(Project project)
        {
            //Build create project XML

            //string projectXML = this.BuildProjectXML(project);

            //Post it to MarkLogic  
            Logger.Debug("CreateProject");  
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
        ///functionalities for UpdateProject
        public object UpdateProject(Project project)
        {
            Logger.Debug("UpdateProject");  
            return this.dal.UpdateProject(project);
        }
        ///functionalities for DeleteProject
        public object DeleteProject(Project project)
        {
            Logger.Debug("DeleteProject"); 
            return this.dal.DeleteProject(project);
        }
        ///functionalities for GetProjectDetails
        public object GetProjectDetails(string uri)
        {
            Logger.Debug("GetProjectDetails"); 
            return this.dal.GetProjectDetails(uri);
        }
        ///functionalities for GetProjectMasterData
        public object GetProjectMasterData(List<Project> ProjectDetail)
        {
            Logger.Debug("GetProjectMasterData"); 
            return this.dal.GetProjectMasterData(ProjectDetail);
        }
        ///functionalities for SearchProjects
        public object SearchProjects(string searchText, int pageNumber, int pageSize, string orderBy)
        {
            Logger.Debug("SearchProjects"); 
            return this.dal.SearchProjects(searchText, pageNumber, pageSize, orderBy);
        }
    }
}

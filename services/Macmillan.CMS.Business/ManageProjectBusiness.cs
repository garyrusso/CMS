
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
        /// <summary>
        /// ManageProjectBusiness dependency injection
        /// </summary>
        /// <param name="manageProjectDAL"></param>
        public ManageProjectBusiness(IManageProjectDAL manageProjectDAL)
        {
            this.dal = manageProjectDAL;
        }
       
        /// <summary>
        /// CreateProject with given details
        /// </summary>
        /// <param name="project"></param>
        /// <returns></returns>
        public object CreateProject(Project project)
        {
            Logger.Debug(" Entering CreateProject");
            //Build create project XML

            //string projectXML = this.BuildProjectXML(project);

            //Post it to MarkLogic  
            Logger.Debug(" Exiting CreateProject");  
            return this.dal.CreateProject(project);
        }

        /// <summary>
        /// BuildProjectXML with given details
        /// </summary>
        /// <param name="project"></param>
        /// <returns></returns>
        private string BuildProjectXML(Project project)
        {
            Logger.Debug(" Entering BuildProjectXML");
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
            Logger.Debug(" Exiting BuildProjectXML");
            return text.ToString();
        }

        /// <summary>
        /// UpdateProject with given details
        /// </summary>
        /// <param name="project"></param>
        /// <returns></returns>
        public object UpdateProject(Project project)
        {
            Logger.Debug(" Entering UpdateProject");
            Logger.Debug(" Exiting UpdateProject");
            return this.dal.UpdateProject(project);
        }
  
        /// <summary>
        /// DeleteProject with given details
        /// </summary>
        /// <param name="project"></param>
        /// <returns></returns>
        public object DeleteProject(Project project)
        {
            Logger.Debug(" Entering DeleteProject");
            Logger.Debug(" Exiting DeleteProject"); 
            return this.dal.DeleteProject(project);
        }

        /// <summary>
        /// GetProjectDetails with given details
        /// </summary>
        /// <param name="uri"></param>
        /// <returns></returns>
        public object GetProjectDetails(string uri)
        {
            Logger.Debug("Entering GetProjectDetails");
            Logger.Debug("Exiting GetProjectDetails"); 
            return this.dal.GetProjectDetails(uri);
        }
        
        /// <summary>
        /// GetProjectMasterData with given details
        /// </summary>
        /// <param name="ProjectDetail"></param>
        /// <returns></returns>
        public object GetProjectMasterData(List<Project> ProjectDetail)
        {
            Logger.Debug("Entering GetProjectMasterData");
            Logger.Debug("Exiting GetProjectMasterData"); 
            return this.dal.GetProjectMasterData(ProjectDetail);
        }
        
        /// <summary>
        /// SearchProjects with given details
        /// </summary>
        /// <param name="searchText"></param>
        /// <param name="pageNumber"></param>
        /// <param name="pageSize"></param>
        /// <param name="orderBy"></param>
        /// <returns></returns>
        public object SearchProjects(string searchText, int pageNumber, int pageSize, string orderBy)
        {
            Logger.Debug("Entering SearchProjects");
            Logger.Debug("Exiting SearchProjects"); 
            return this.dal.SearchProjects(searchText, pageNumber, pageSize, orderBy);
        }
    }
}

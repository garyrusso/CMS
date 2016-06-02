
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
using Macmillan.CMS.Common;
using System.Xml;

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
        /// <returns>Returns object for CreateProject</returns>
        public object CreateProject(Project project)
        {
            Logger.Debug(" Entering CreateProject");

            string projectXML = this.BuildCreateProjectXML(project);

            this.dal.CreateProject(projectXML, "/projects/" + project.Title);
            
            var results = new { Title = project.Title, uri = "/projects/" + project.Title };

            Logger.Debug(" Exiting CreateProject");
            return results;

        }

        /// <summary>
        /// BuildProjectXML with given details
        /// </summary>
        /// <param name="project"></param>
        /// <returns>Returns String BuildCreateProjectXML</returns>
        private string BuildCreateProjectXML(Project project)
        {
            Logger.Debug(" Entering BuildProjectXML");

            StringBuilder text = new StringBuilder(File.ReadAllText(ConfigurationManager.AppSettings["CreateProjectXMLPath"]));
            
            text.Replace("##systemId##", Guid.NewGuid().ToString("N").Substring(0, 32));
            text.Replace("##docUri##", "/projects/" + project.Title);            
            text.Replace("##title##", project.Title);
            text.Replace("##description##", project.Description);
            text.Replace("##projectState##", project.ProjectState);

            text.Replace("##dateCreated##", DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
            text.Replace("##createdby##", project.CreatedBy);
            text.Replace("##dateLastModified##", DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
            text.Replace("##modifiedBy##", project.CreatedBy);

            if (project.SubjectHeadings != null)
            {
                StringBuilder subjects = new StringBuilder();

                foreach (string subject in project.SubjectHeadings)
                {
                    subjects.Append("<mml:subjectHeading>" + subject + "</mml:subjectHeading>");
                }
                text.Replace("##subjects##", subjects.ToString());
            }


            if (project.SubjectKeywords != null)
            {
                StringBuilder keywords = new StringBuilder();

                foreach (string keyword in project.SubjectKeywords)
                {
                    keywords.Append("<mml:subjectKeyword>" + keyword + "</mml:subjectKeyword>");
                }

                text.Replace("##keywords##", keywords.ToString());
            }

            
            Logger.Debug(" Exiting BuildProjectXML");
            return text.ToString();
        }

        /// <summary>
        /// BuildProjectXML with given details
        /// </summary>
        /// <param name="project"></param>
        /// <returns>Returns string BuildEditProjectXML</returns>
        private string BuildEditProjectXML(Project project)
        {
            Logger.Debug(" Entering BuildProjectXML");

            StringBuilder text = new StringBuilder(File.ReadAllText(ConfigurationManager.AppSettings["CreateProjectXMLPath"]));

            text.Replace("##systemId##", project.SystemId);
            text.Replace("##docUri##",  project.ProjectURL);
            text.Replace("##title##", project.Title);
            text.Replace("##description##",  project.Description);
            text.Replace("##projectState##", project.ProjectState);

            text.Replace("##dateCreated##", project.DateCreated.ToString());
            text.Replace("##createdby##", project.CreatedBy);
            text.Replace("##dateLastModified##", DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
            text.Replace("##modifiedBy##", project.ModifiedBy);

            if (project.SubjectHeadings != null)
            {
                StringBuilder subjects = new StringBuilder();

                foreach (string subject in project.SubjectHeadings)
                {
                    subjects.Append("<mml:subjectHeading>" + subject + "</mml:subjectHeading>");
                }
                text.Replace("##subjects##", subjects.ToString());
            }


            if (project.SubjectKeywords != null)
            {
                StringBuilder keywords = new StringBuilder();

                foreach (string keyword in project.SubjectKeywords)
                {
                    keywords.Append("<mml:subjectKeyword>" + keyword + "</mml:subjectKeyword>");
                }

                text.Replace("##keywords##", keywords.ToString());
            }
            
            Logger.Debug(" Exiting BuildProjectXML");
            return text.ToString();
        }

        /// <summary>
        /// UpdateProject with given details
        /// </summary>
        /// <param name="project"></param>
        /// <returns>Returns object for UpdateProject</returns>
        public object UpdateProject(Project project)
        {
            Logger.Debug(" Entering UpdateProject");

            string projectXML = this.BuildEditProjectXML(project);

            this.dal.UpdateProject(projectXML, "/projects/" + project.Title);

            var results = new { Title = project.Title, uri = "/projects/" + project.Title };

            Logger.Debug(" Exiting UpdateProject");
            return results;
        }
  
        /// <summary>
        /// DeleteProject with given details
        /// </summary>
        /// <param name="project"></param>
        /// <returns>Returns object for DeleteProject</returns>
        public object DeleteProject(Project project)
        {
            Logger.Debug(" Entering DeleteProject");

            project.ProjectState = "Inactive";
            string projectXML = this.BuildEditProjectXML(project);

            this.dal.DeleteProject(projectXML, "/projects/" + project.Title);

            var results = new { Title = project.Title, uri = "/projects/" + project.Title };

            Logger.Debug(" Exiting DeleteProject");
            return results;
        }

        /// <summary>
        /// GetProjectDetails with given details
        /// </summary>
        /// <param name="uri"></param>
        /// <returns>Returns object for GetProjectDetails</returns>
        public object GetProjectDetails(string uri)
        {
            Logger.Debug("Entering GetProjectDetails"); 
            var results= this.dal.GetProjectDetails(uri);

            Project proj = this.GetProjectObject(results.ToString());

            Logger.Debug("Exiting GetProjectDetails");
            return proj;
        }

        /// <summary>
        /// GetProjectObject with given details
        /// </summary>
        /// <param name="projXml"></param>
        /// <returns>Returns Project GetProjectObject</returns>
        private Project GetProjectObject(string projXml)
        {
            XmlDocument doc = new XmlDocument();

            doc.LoadXml(projXml);
            var nsmgr = new XmlNamespaceManager(doc.NameTable);
            nsmgr.AddNamespace("mml", "http://macmillanlearning.com/");
            nsmgr.AddNamespace("dc", "http://purl.org/dc/elements/1.1/");

            Project proj = new Project();

            proj.SystemId = doc.SelectSingleNode("/mml:cmsDocument/mml:metadata/mml:cmsCore/mml:administrative/mml:systemID", nsmgr).InnerText;
            proj.ProjectURL = doc.SelectSingleNode("/mml:cmsDocument/mml:metadata/mml:cmsCore/mml:administrative/mml:uri", nsmgr).InnerText;

            string dateCrtd = doc.SelectSingleNode("/mml:cmsDocument/mml:metadata/mml:cmsCore/mml:administrative/mml:dateCreated", nsmgr).InnerText;

            if(!string.IsNullOrEmpty(dateCrtd))
                proj.DateCreated = Convert.ToDateTime(dateCrtd);

            proj.CreatedBy = doc.SelectSingleNode("/mml:cmsDocument/mml:metadata/mml:cmsCore/mml:administrative/mml:createdBy", nsmgr).InnerText;

            string dateModfd = doc.SelectSingleNode("/mml:cmsDocument/mml:metadata/mml:cmsCore/mml:administrative/mml:dateLastModified", nsmgr).InnerText;

            if (!string.IsNullOrEmpty(dateModfd))
                proj.DateModified = Convert.ToDateTime(dateModfd);

            proj.ModifiedBy = doc.SelectSingleNode("/mml:cmsDocument/mml:metadata/mml:cmsCore/mml:administrative/mml:modifiedBy", nsmgr).InnerText;

            proj.Title = doc.SelectSingleNode("/mml:cmsDocument/mml:metadata/mml:cmsCore/mml:descriptive/dc:title", nsmgr).InnerText;
            proj.Description = doc.SelectSingleNode("/mml:cmsDocument/mml:metadata/mml:cmsCore/mml:descriptive/dc:description", nsmgr).InnerText;

            XmlNodeList subjectHeadings = doc.SelectNodes("/mml:cmsDocument/mml:metadata/mml:cmsCore/mml:semantic/mml:subjectHeadings/mml:subjectHeading", nsmgr);

            List<string> subjects = new List<string>();
            for (int i = 0; i < subjectHeadings.Count; i++)
            {
                subjects.Add(subjectHeadings[i].InnerText);
            }

            proj.SubjectHeadings = subjects.ToArray();

            XmlNodeList subjectKeywords = doc.SelectNodes("/mml:cmsDocument/mml:metadata/mml:cmsCore/mml:semantic/mml:subjectKeywords/mml:subjectKeyword", nsmgr);

            List<string> keywords = new List<string>();
            for (int i = 0; i < subjectKeywords.Count; i++)
            {
                keywords.Add(subjectKeywords[i].InnerText);
            }

            proj.SubjectKeywords = keywords.ToArray();

            proj.ProjectState = doc.SelectSingleNode("/mml:cmsDocument/mml:metadata/mml:project/mml:descriptive/mml:projectState", nsmgr).InnerText;

            return proj;
        }

        /// <summary>
        /// GetProjectMasterData with given details
        /// </summary>
        /// <param name="ProjectDetail"></param>
        /// <returns>Returns object for GetProjectMasterData</returns>
        public object GetProjectMasterData(List<Project> ProjectDetail)
        {
            Logger.Debug("Entering GetProjectMasterData");        
            var results= this.dal.GetProjectMasterData(ProjectDetail);
            Logger.Debug("Exiting GetProjectMasterData");
            return results;
        }
        
        /// <summary>
        /// SearchProjects with given details
        /// </summary>
        /// <param name="searchText"></param>
        /// <param name="pageNumber"></param>
        /// <param name="pageSize"></param>
        /// <param name="orderBy"></param>
        /// <returns>Returns object for SearchProjects</returns>
        public object SearchProjects(string searchText, int pageNumber, int pageSize, string orderBy)
        {
            Logger.Debug("Entering SearchProjects");        
            var results = this.dal.SearchProjects(searchText, pageNumber, pageSize, orderBy);
            Logger.Debug("Exiting SearchProjects");
            return results;
        }
    }
}

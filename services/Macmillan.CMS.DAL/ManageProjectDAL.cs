
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Macmillan.CMS.Common;
using Macmillan.CMS.Common.Models;
using Newtonsoft.Json.Linq;
using Macmillan.CMS.Common.Logging;
using System.Configuration;
using System.Xml;

namespace Macmillan.CMS.DAL
{
    public class ManageProjectDAL : IManageProjectDAL
    {
        /// <summary>
        /// Create a Project with given details
        /// </summary>
        /// <param name="project"></param>
        /// <returns></returns>
        public object CreateProject(string projXml, string projUri)
        {
            //Call ML and post the project xml
            Logger.Info("Entering CreateProject");

            //Post it to MarkLogic  
            string mlUrl = ConfigurationManager.AppSettings["MarkLogic_CRUD_URL"] + "project?name=project&rs:format=json";
            MLReader mlReader = new MLReader();
            string results = mlReader.HttpInvoke(mlUrl, SupportedHttpMethods.POST, "application/json", projXml);
            Logger.Debug("Logging Results for CreateProject with mlUrl");
            Logger.Info("Exitinging CreateProject");
            return mlReader.ConverttoJson<object>(results);
        }

        /// <summary>
        /// update the project with given details
        /// </summary>
        /// <param name="project"></param>
        /// <returns></returns>
        public object UpdateProject(string projXml, string projUri)
        {
            Logger.Info("Entering UpdateProject");
            //Call ML and Put the project xml

            //Post it to MarkLogic  
            string mlUrl = ConfigurationManager.AppSettings["MarkLogic_CRUD_URL"] + "project?name=project&rs:format=json&rs:uri=" + projUri;
            MLReader mlReader = new MLReader();
            string results = mlReader.HttpInvoke(mlUrl, SupportedHttpMethods.PUT, "application/json", projXml);
            Logger.Debug("Logging Results for UpdateProject with mlUrl");
            Logger.Info("Exitinging UpdateProject");
            return mlReader.ConverttoJson<object>(results);
            
        }

        /// <summary>
        /// delete the Project with given details
        /// </summary>
        /// <param name="project"></param>
        /// <returns></returns>
        public object DeleteProject(string projUri)
        {
            Logger.Info("Entry DeleteProject");
           
            //Post it to MarkLogic  
            string mlUrl = ConfigurationManager.AppSettings["MarkLogic_CRUD_URL"] + "project?name=project&rs:format=json&rs:uri=" + projUri;
            MLReader mlReader = new MLReader();
            string results = mlReader.HttpInvoke(mlUrl, SupportedHttpMethods.DELETE, "application/json");
            Logger.Debug("Logging Results for DeleteProject with mlUrl");
            Logger.Info("Exiting DeleteProject");
            return mlReader.ConverttoJson<object>(results);
         
        }

        /// <summary>
        /// Get project details with given details
        /// </summary>
        /// <param name="uri"></param>
        /// <returns></returns>
        public object GetProjectDetails(string uri)
        {
            Logger.Info("Entering GetProjectDetails");

            MLReader mlReader = new MLReader();
            
            //get Marklogic url for CRUD operations
            string mlUrl = ConfigurationManager.AppSettings["MarkLogic_CRUD_URL"] + "project?name=project&rs:uri="+ uri +"&rs:format=json";
            string results = mlReader.GetHttpContent(mlUrl,"application/json");
            Logger.Debug("Logging Results for GetProjectDetails with mlUrl");
            Logger.Info("Exiting GetProjectDetails");       
            return mlReader.ConverttoJson<object>(results); 
        }

        /// <summary>
        /// get project details with given details
        /// </summary>
        /// <param name="ProjectDetail"></param>
        /// <returns></returns>
        public object GetProjectMasterData(List<Project> ProjectDetail)
        {
            Logger.Info("Entering GetProjectMasterData");
            JsonNetSerialization ser = new JsonNetSerialization();
            string content = @"{'Title': 'Hockenbury 5e-1',
                                  'uri': '/mydocuments/project1.xml',
                                  'path': 'fn:doc(\'/mydocuments/project1.xml\')',
                                  'href': '/v1/documents?uri=%2Fmydocuments%2Fproject1.xml',
                                  'mimetype': 'application/xml',
                                  'format': 'xml',
                                  'dateLastModified': '2015-04-15 13:30',
                                  'username': 'bcross',
                                  'fullName': 'Brian Cross'
                                   }
                                   }";
            
            var results= ser.DeSerialize(content);
            Logger.Debug("Logging Results for JsonNetSerialization with GetProjectMasterData ProjectDetail");
            Logger.Info("Exiting GetProjectMasterData");
            return results;
        }

        /// <summary>
        /// Search Project for the given details
        /// </summary>
        /// <param name="searchText"></param>
        /// <param name="pageNumber"></param>
        /// <param name="pageSize"></param>
        /// <param name="orderBy"></param>
        /// <returns></returns>
        public object SearchProjects(string searchText, int pageNumber, int pageSize, string orderBy)
        {
            //Call ML and SearchProjects
            Logger.Info("Entering SearchProjects");
            JsonNetSerialization ser = new JsonNetSerialization();
            MLReader mlReader = new MLReader();
            searchText = System.Web.HttpContext.Current.Server.UrlEncode(searchText);
            //get Marklogic url for CRUD operations                    
            string mlUrl = ConfigurationManager.AppSettings["MarkLogic_CRUD_URL"] + "project?name=project&rs:q=" + searchText + "&rs:format=json";
            string results = mlReader.GetHttpContent(mlUrl, "application/json");
            Logger.Debug("Logging Results for SearchProjects with pageNumber, pageSize in mlUrl");
            Logger.Info("Exiting SearchProjects");
            return mlReader.ConverttoJson<object>(results);
        }
    }
}






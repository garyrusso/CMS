
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
            Logger.Debug("Entering CreateProject");
//            JsonNetSerialization ser = new JsonNetSerialization();
//            string content = @"{'Title': 'Hockenbury 5e-1',
//                                  'uri': '/mydocuments/project1.xml',
//                                  'path': 'fn:doc(\'/mydocuments/project1.xml\')',
//                                  'href': '/v1/documents?uri=%2Fmydocuments%2Fproject1.xml',
//                                  'mimetype': 'application/xml',
//                                  'format': 'xml',
//                                  'dateLastModified': '2015-04-15 13:30',
//                                  'username': 'bcross',
//                                  'fullName': 'Brian Cross'                                   
//                                   }";
         
//            var results = ser.DeSerialize(content);

            //Post it to MarkLogic  
            string mlUrl = ConfigurationManager.AppSettings["MarkLogic_CRUD_URL"] + "?uri=" + projUri;
            MLReader mlReader = new MLReader();
            string results = mlReader.HttpInvoke(mlUrl, SupportedHttpMethods.PUT, "application/xml", projXml);

            Logger.Debug("Exitinging CreateProject");
            return results;
        }

        /// <summary>
        /// update the project with given details
        /// </summary>
        /// <param name="project"></param>
        /// <returns></returns>
        public object UpdateProject(string projXml, string projUri)
        {
            Logger.Debug("Entering UpdateProject");
            //Call ML and Put the project xml

            //Post it to MarkLogic  
            string mlUrl = ConfigurationManager.AppSettings["MarkLogic_CRUD_URL"] + "?uri=" + projUri;
            MLReader mlReader = new MLReader();
            string results = mlReader.HttpInvoke(mlUrl, SupportedHttpMethods.PUT, "application/xml", projXml);

            Logger.Debug("Exitinging UpdateProject");
            return results;
            
        }

        /// <summary>
        /// delete the Project with given details
        /// </summary>
        /// <param name="project"></param>
        /// <returns></returns>
        public object DeleteProject(string projXml, string projUri)
        {
            Logger.Debug("Entry DeleteProject");
           
            //Post it to MarkLogic  
            string mlUrl = ConfigurationManager.AppSettings["MarkLogic_CRUD_URL"] + "?uri=" + projUri;
            MLReader mlReader = new MLReader();
            string results = mlReader.HttpInvoke(mlUrl, SupportedHttpMethods.PUT, "application/xml", projXml);

            Logger.Debug("Exiting DeleteProject");
            return true;
         
        }

        /// <summary>
        /// Get project details with given details
        /// </summary>
        /// <param name="uri"></param>
        /// <returns></returns>
        public object GetProjectDetails(string uri)
        {
            Logger.Debug("Entering GetProjectDetails");

            MLReader mlReader = new MLReader();

            //get Marklogic url for CRUD operations
            string mlUrl = ConfigurationManager.AppSettings["MarkLogic_CRUD_URL"];
            string results = mlReader.GetHttpContent(mlUrl + "?uri=" + uri, "application/json");

            Logger.Debug("Exiting GetProjectDetails");
            
            ////XmlDocument doc = new XmlDocument();

            ////doc.LoadXml(results);
            ////XmlNode node = doc.SelectSingleNode("/mml:cmsDocument/mml:metadata/mml:cmsCore/mml:administrative/mml:uri");

            ////string test = node.InnerText;

            return results;
        }

        /// <summary>
        /// get project details with given details
        /// </summary>
        /// <param name="ProjectDetail"></param>
        /// <returns></returns>
        public object GetProjectMasterData(List<Project> ProjectDetail)
        {
            Logger.Debug("Entering GetProjectMasterData");
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
            Logger.Debug("Exiting GetProjectMasterData");
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
            Logger.Debug("Entering SearchProjects");
            JsonNetSerialization ser = new JsonNetSerialization();
            string content = @"{
                           'total': 27,
                           'start': 1,
                           'page-length': 10,
                           'results': [{
                                  'Title': 'Hockenbury 5e-1',
                                  'uri': '/mydocuments/project1.xml',
                                  'path': 'fn:doc(\'/mydocuments/project1.xml\')',
                                  'href': '/v1/documents?uri=%2Fmydocuments%2Fproject1.xml',
                                  'mimetype': 'application/xml',
                                  'format': 'xml',
                                  'dateLastModified': '2015-04-15 13:30',
                                  'username': 'bcross',
                                  'fullName': 'Brian Cross'

                           },{
                                  'Title': 'Hockenbury 5e-2',
                                  'uri': '/mydocuments/project2.xml',
                                  'path': 'fn:doc(\'/mydocuments/project2.xml\')',
                                  'href': '/v1/documents?uri=%2Fmydocuments%2Fproject2.xml',
                                  'mimetype': 'application/xml',
                                  'format': 'xml',
                                  'dateLastModified': '2015-04-15 13:30',
                                  'username': 'bcross',
                                  'fullName': 'Brian Cross'

                           },{
                                  'Title': 'Hockenbury 5e-3',
                                  'uri': '/mydocuments/project3.xml',
                                  'path': 'fn:doc(\'/mydocuments/project3.xml\')',
                                  'href': '/v1/documents?uri=%2Fmydocuments%2Fproject3.xml',
                                  'mimetype': 'application/xml',
                                  'format': 'xml',
                                  'dateLastModified': '2015-04-15 13:30',
                                  'username': 'bcross',
                                  'fullName': 'Brian Cross'

                           },{
                                  'Title': 'Hockenbury 5e-4',
                                  'uri': '/mydocuments/project4.xml',
                                  'path': 'fn:doc(\'/mydocuments/project4.xml\')',
                                  'href': '/v1/documents?uri=%2Fmydocuments%2Fproject4.xml',
                                  'mimetype': 'application/xml',
                                  'format': 'xml',
                                  'dateLastModified': '2015-04-15 13:30',
                                  'username': 'bcross',
                                  'fullName': 'Brian Cross'

                           },{
                                  'Title': 'Hockenbury 5e-5',
                                  'uri': '/mydocuments/project4.xml',
                                  'path': 'fn:doc(\'/mydocuments/project4.xml\')',
                                  'href': '/v1/documents?uri=%2Fmydocuments%2Fproject4.xml',
                                  'mimetype': 'application/xml',
                                  'format': 'xml',
                                  'dateLastModified': '2015-04-15 13:30',
                                  'username': 'bcross',
                                  'fullName': 'Brian Cross'

                           },{
                                  'Title': 'Hockenbury 5e-6',
                                  'uri': '/mydocuments/project4.xml',
                                  'path': 'fn:doc(\'/mydocuments/project4.xml\')',
                                  'href': '/v1/documents?uri=%2Fmydocuments%2Fproject4.xml',
                                  'mimetype': 'application/xml',
                                  'format': 'xml',
                                  'dateLastModified': '2015-04-15 13:30',
                                  'username': 'bcross',
                                  'fullName': 'Brian Cross'

                           },{
                                  'Title': 'Hockenbury 5e-7',
                                  'uri': '/mydocuments/project4.xml',
                                  'path': 'fn:doc(\'/mydocuments/project4.xml\')',
                                  'href': '/v1/documents?uri=%2Fmydocuments%2Fproject4.xml',
                                  'mimetype': 'application/xml',
                                  'format': 'xml',
                                  'dateLastModified': '2015-04-15 13:30',
                                  'username': 'bcross',
                                  'fullName': 'Brian Cross'

                           },{
                                  'Title': 'Hockenbury 5e-8',
                                  'uri': '/mydocuments/project4.xml',
                                  'path': 'fn:doc(\'/mydocuments/project4.xml\')',
                                  'href': '/v1/documents?uri=%2Fmydocuments%2Fproject4.xml',
                                  'mimetype': 'application/xml',
                                  'format': 'xml',
                                  'dateLastModified': '2015-04-15 13:30',
                                  'username': 'bcross',
                                  'fullName': 'Brian Cross'

                           },{
                                  'Title': 'Hockenbury 5e-9',
                                  'uri': '/mydocuments/project4.xml',
                                  'path': 'fn:doc(\'/mydocuments/project4.xml\')',
                                  'href': '/v1/documents?uri=%2Fmydocuments%2Fproject4.xml',
                                  'mimetype': 'application/xml',
                                  'format': 'xml',
                                  'dateLastModified': '2015-04-15 13:30',
                                  'username': 'bcross',
                                  'fullName': 'Brian Cross'

                           },{
                                  'Title': 'Hockenbury 5e-10',
                                  'uri': '/mydocuments/project4.xml',
                                  'path': 'fn:doc(\'/mydocuments/project4.xml\')',
                                  'href': '/v1/documents?uri=%2Fmydocuments%2Fproject4.xml',
                                  'mimetype': 'application/xml',
                                  'format': 'xml',
                                  'dateLastModified': '2015-04-15 13:30',
                                  'username': 'bcross',
                                  'fullName': 'Brian Cross'

                           },{
                                  'Title': 'Hockenbury 5e-11',
                                  'uri': '/mydocuments/project4.xml',
                                  'path': 'fn:doc(\'/mydocuments/project4.xml\')',
                                  'href': '/v1/documents?uri=%2Fmydocuments%2Fproject4.xml',
                                  'mimetype': 'application/xml',
                                  'format': 'xml',
                                  'dateLastModified': '2015-04-15 13:30',
                                  'username': 'bcross',
                                  'fullName': 'Brian Cross'

                           },{
                                  'Title': 'Hockenbury 5e-12',
                                  'uri': '/mydocuments/project4.xml',
                                  'path': 'fn:doc(\'/mydocuments/project4.xml\')',
                                  'href': '/v1/documents?uri=%2Fmydocuments%2Fproject4.xml',
                                  'mimetype': 'application/xml',
                                  'format': 'xml',
                                  'dateLastModified': '2015-04-15 13:30',
                                  'username': 'bcross',
                                  'fullName': 'Brian Cross'

                           },{
                                  'Title': 'Hockenbury 5e-13',
                                  'uri': '/mydocuments/project4.xml',
                                  'path': 'fn:doc(\'/mydocuments/project4.xml\')',
                                  'href': '/v1/documents?uri=%2Fmydocuments%2Fproject4.xml',
                                  'mimetype': 'application/xml',
                                  'format': 'xml',
                                  'dateLastModified': '2015-04-15 13:30',
                                  'username': 'bcross',
                                  'fullName': 'Brian Cross'

                           }, {
                                  'Title': 'Hockenbury 5e-14',
                                  'uri': '/mydocuments/project4.xml',
                                  'path': 'fn:doc(\'/mydocuments/project4.xml\')',
                                  'href': '/v1/documents?uri=%2Fmydocuments%2Fproject4.xml',
                                  'mimetype': 'application/xml',
                                  'format': 'xml',
                                  'dateLastModified': '2015-04-15 13:30',
                                  'username': 'bcross',
                                  'fullName': 'Brian Cross'

                           },{
                                  'Title': 'Hockenbury 5e-15',
                                  'uri': '/mydocuments/project4.xml',
                                  'path': 'fn:doc(\'/mydocuments/project4.xml\')',
                                  'href': '/v1/documents?uri=%2Fmydocuments%2Fproject4.xml',
                                  'mimetype': 'application/xml',
                                  'format': 'xml',
                                  'dateLastModified': '2015-04-15 13:30',
                                  'username': 'bcross',
                                  'fullName': 'Brian Cross'

                           },{
                                  'Title': 'Hockenbury 5e-16',
                                  'uri': '/mydocuments/project4.xml',
                                  'path': 'fn:doc(\'/mydocuments/project4.xml\')',
                                  'href': '/v1/documents?uri=%2Fmydocuments%2Fproject4.xml',
                                  'mimetype': 'application/xml',
                                  'format': 'xml',
                                  'dateLastModified': '2015-04-15 13:30',
                                  'username': 'bcross',
                                  'fullName': 'Brian Cross'

                           }, {
                                  'Title': 'Hockenbury 5e-17',
                                  'uri': '/mydocuments/project4.xml',
                                  'path': 'fn:doc(\'/mydocuments/project4.xml\')',
                                  'href': '/v1/documents?uri=%2Fmydocuments%2Fproject4.xml',
                                  'mimetype': 'application/xml',
                                  'format': 'xml',
                                  'dateLastModified': '2015-04-15 13:30',
                                  'username': 'bcross',
                                  'fullName': 'Brian Cross'

                           }, {
                                  'Title': 'Hockenbury 5e-18',
                                  'uri': '/mydocuments/project4.xml',
                                  'path': 'fn:doc(\'/mydocuments/project4.xml\')',
                                  'href': '/v1/documents?uri=%2Fmydocuments%2Fproject4.xml',
                                  'mimetype': 'application/xml',
                                  'format': 'xml',
                                  'dateLastModified': '2015-04-15 13:30',
                                  'username': 'bcross',
                                  'fullName': 'Brian Cross'

                           }, {
                                  'Title': 'Hockenbury 5e-19',
                                  'uri': '/mydocuments/project4.xml',
                                  'path': 'fn:doc(\'/mydocuments/project4.xml\')',
                                  'href': '/v1/documents?uri=%2Fmydocuments%2Fproject4.xml',
                                  'mimetype': 'application/xml',
                                  'format': 'xml',
                                  'dateLastModified': '2015-04-15 13:30',
                                  'username': 'bcross',
                                  'fullName': 'Brian Cross'

                           },{
                                  'Title': 'Hockenbury 5e-20',
                                  'uri': '/mydocuments/project4.xml',
                                  'path': 'fn:doc(\'/mydocuments/project4.xml\')',
                                  'href': '/v1/documents?uri=%2Fmydocuments%2Fproject4.xml',
                                  'mimetype': 'application/xml',
                                  'format': 'xml',
                                  'dateLastModified': '2015-04-15 13:30',
                                  'username': 'bcross',
                                  'fullName': 'Brian Cross'

                           },{
                                  'Title': 'Hockenbury 5e-21',
                                  'uri': '/mydocuments/project4.xml',
                                  'path': 'fn:doc(\'/mydocuments/project4.xml\')',
                                  'href': '/v1/documents?uri=%2Fmydocuments%2Fproject4.xml',
                                  'mimetype': 'application/xml',
                                  'format': 'xml',
                                  'dateLastModified': '2015-04-15 13:30',
                                  'username': 'bcross',
                                  'fullName': 'Brian Cross'

                           },{
                                  'Title': 'Hockenbury 5e-22',
                                  'uri': '/mydocuments/project4.xml',
                                  'path': 'fn:doc(\'/mydocuments/project4.xml\')',
                                  'href': '/v1/documents?uri=%2Fmydocuments%2Fproject4.xml',
                                  'mimetype': 'application/xml',
                                  'format': 'xml',
                                  'dateLastModified': '2015-04-15 13:30',
                                  'username': 'bcross',
                                  'fullName': 'Brian Cross'

                           },{
                                  'Title': 'Hockenbury 5e-23',
                                  'uri': '/mydocuments/project4.xml',
                                  'path': 'fn:doc(\'/mydocuments/project4.xml\')',
                                  'href': '/v1/documents?uri=%2Fmydocuments%2Fproject4.xml',
                                  'mimetype': 'application/xml',
                                  'format': 'xml',
                                  'dateLastModified': '2015-04-15 13:30',
                                  'username': 'bcross',
                                  'fullName': 'Brian Cross'

                           },{
                                  'Title': 'Hockenbury 5e-24',
                                  'uri': '/mydocuments/project4.xml',
                                  'path': 'fn:doc(\'/mydocuments/project4.xml\')',
                                  'href': '/v1/documents?uri=%2Fmydocuments%2Fproject4.xml',
                                  'mimetype': 'application/xml',
                                  'format': 'xml',
                                  'dateLastModified': '2015-04-15 13:30',
                                  'username': 'bcross',
                                  'fullName': 'Brian Cross'

                           },{
                                  'Title': 'Hockenbury 5e-25',
                                  'uri': '/mydocuments/project4.xml',
                                  'path': 'fn:doc(\'/mydocuments/project4.xml\')',
                                  'href': '/v1/documents?uri=%2Fmydocuments%2Fproject4.xml',
                                  'mimetype': 'application/xml',
                                  'format': 'xml',
                                  'dateLastModified': '2015-04-15 13:30',
                                  'username': 'bcross',
                                  'fullName': 'Brian Cross'

                           },{
                                  'Title': 'Hockenbury 5e-26',
                                  'uri': '/mydocuments/project4.xml',
                                  'path': 'fn:doc(\'/mydocuments/project4.xml\')',
                                  'href': '/v1/documents?uri=%2Fmydocuments%2Fproject4.xml',
                                  'mimetype': 'application/xml',
                                  'format': 'xml',
                                  'dateLastModified': '2015-04-15 13:30',
                                  'username': 'bcross',
                                  'fullName': 'Brian Cross'
                           },{
                                  'Title': 'Hockenbury 5e-27',
                                  'uri': '/mydocuments/project4.xml',
                                  'path': 'fn:doc(\'/mydocuments/project4.xml\')',
                                  'href': '/v1/documents?uri=%2Fmydocuments%2Fproject4.xml',
                                  'mimetype': 'application/xml',
                                  'format': 'xml',
                                  'dateLastModified': '2015-04-15 13:30',
                                  'username': 'bcross',
                                  'fullName': 'Brian Cross'
                           }],
                           'facets': {
                                'Title': {
                                         'type': 'xs:string',
                                         'facetValues': [{
                                               'name': 'Hockenbury 5e',
                                               'count': 4,
                                               'value': 'Hockenbury 5e'
                                         }, {
                                               'name': 'Hockenbury 5e-1',
                                               'count': 1,
                                               'value': 'Hockenbury 5e-1'
                                         }, {
                                               'name': 'Hockenbury 5e-2',
                                               'count': 1,
                                               'value': 'Hockenbury 5e-2'
                                         }, {
                                               'name': 'Hockenbury 5e-3',
                                               'count': 1,
                                               'value': 'Hockenbury 5e-3'
                                         }, {
                                               'name': 'Hockenbury 5e-4',
                                               'count': 1,
                                               'value': 'Hockenbury 5e-4'
                                         }, {
                                               'name': 'Myers 11e EPUB3',
                                               'count': 1,
                                               'value': 'Myers 11e EPUB3'
                                         }]
                                  },
                                  'projectState': {
                                         'type': 'xs:string',
                                         'facetValues': [{
                                               'name': 'Active',
                                               'count': 12,
                                               'value': 'Active'
                                         }, {
                                               'name': 'InActive',
                                               'count': 1,
                                               'value': 'InActive'
                                         }]
                                  },                                
                                  'Subjects': {
                                         'type': 'xs:string',
                                         'facetValues': [{
                                               'name': 'Psychology',
                                               'count': 13,
                                               'value': 'Psychology'
                                         }]
                                  },
                                  'query': {
                                         'and-query': [{
                                               'element-range-query': [{
                                                      'operator': '=',
                                                      'element': '_1:subjectHeading',
                                                      'value': [{
                                                             'type': 'xs:string',
                                                             '_value': 'Psychology'
                                                      }],
                                                      'option': 'collation=http://marklogic.com/collation/'
                                               }],
                                               'annotation': [{
                                                      'operator-ref': 'sort',
                                                      'state-ref': 'relevance'
                                               }]
                                         }]
                                  }
                           }
                    }";
          
            var results= ser.DeSerialize(content);
            Logger.Debug("Exiting SearchProjects");
            return results;
        }

    }
}






using Macmillan.CMS.Common;
using Macmillan.CMS.Common.Logging;
using Macmillan.CMS.Common.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Macmillan.CMS.DAL
{
     public class ManageContentDAL : IManageContentDAL
    {
         /// <summary>
        /// CreateContent with given details
         /// </summary>
         /// <param name="content"></param>
         /// <returns></returns>
         public object CreateContent(string projXml, string projUri)
         {
             Logger.Debug("Entering CreateContent");
//             JsonNetSerialization ser = new JsonNetSerialization();
//             string con = @"{'Title': 'Myers 11e EPUB3',
//                          'uri': '/mydocuments/conent1.xml',
//                          'path': 'fn:doc(\'/mydocuments/conent1.xml\')',
//                          'href': '/v1/documents?uri=%2Fmydocuments%2Fconent1.xml',
//                          'mimetype': 'application/xml',
//                          'format': 'xml',
//                          'fileName': 'myers113.epub',
//                          'dateLastModified': '2015-04-15 13:30',
//                          'username': 'bcross',
//                          'fullName': 'Brian Cross',
//                          'audit_info': [
//                            {
//                              'actionType': 'Upload',
//                              'actionCreatedOn': '2015-04-15 13:30',
//                              'actionCreatedBy': 'Brain Cross'
//                            },
//                            {
//                              'actionType': 'Downloaded',
//                              'actionCreatedOn': '2015-04-15 13:30',
//                              'actionCreatedBy': 'Brain Cross'
//                            }
//                          ]
//                        }
//                        ";
//             var results = ser.DeSerialize(con);
             string mlUrl = ConfigurationManager.AppSettings["MarkLogic_CRUD_URL"] + "?uri=" + projUri;
             MLReader mlReader = new MLReader();
             string results = mlReader.HttpInvoke(mlUrl, SupportedHttpMethods.POST, "application/xml", projXml);
             Logger.Debug("Exitinging CreateContent");
             return results;
         }

         /// <summary>
         /// UpdateContent with given details
         /// </summary>
         /// <param name="content"></param>
         /// <returns></returns>
         public object UpdateContent(string projXml, string projUri)
         {
             Logger.Debug("Entering UpdateProject");
             //Call ML and Put the project xml
             string mlUrl = ConfigurationManager.AppSettings["MarkLogic_CRUD_URL"] + "?uri=" + projUri;
             MLReader mlReader = new MLReader();
             string results = mlReader.HttpInvoke(mlUrl, SupportedHttpMethods.PUT, "application/xml", projXml);
             Logger.Debug("Exitinging UpdateProject");
             return results;
         }

         /// <summary>
         /// content with given details
         /// </summary>
         /// <param name="content"></param>
         /// <returns></returns>
         public object DeleteContent(string projXml, string projUri)
         {
             Logger.Debug("Entry DeleteProject");
             string mlUrl = ConfigurationManager.AppSettings["MarkLogic_CRUD_URL"] + "?uri=" + projUri;
             MLReader mlReader = new MLReader();
             string results = mlReader.HttpInvoke(mlUrl, SupportedHttpMethods.DELETE, "application/xml", projXml);
             //Call ML and Delete the project xml
             Logger.Debug("Exiting DeleteProject");
             return results;
         }

         /// <summary>
         /// GetContent with given details
         /// </summary>
         /// <param name="docUri"></param>
         /// <returns></returns>
         public object GetContent(string docUri)
         {
             Logger.Debug("Entering GetContent");
             JsonNetSerialization ser = new JsonNetSerialization();
             string con = @"{'Title': 'Myers 11e EPUB3',
                          'uri': '/mydocuments/conent1.xml',
                          'path': 'fn:doc(\'/mydocuments/conent1.xml\')',
                          'href': '/v1/documents?uri=%2Fmydocuments%2Fconent1.xml',
                          'mimetype': 'application/xml',
                          'format': 'xml',
                          'fileName': 'myers113.epub',
                          'dateLastModified': '2015-04-15 13:30',
                          'username': 'bcross',
                          'fullName': 'Brian Cross',
                          'audit_info': [
                            {
                              'actionType': 'Upload',
                              'actionCreatedOn': '2015-04-15 13:30',
                              'actionCreatedBy': 'Brain Cross'
                            },
                            {
                              'actionType': 'Downloaded',
                              'actionCreatedOn': '2015-04-15 13:30',
                              'actionCreatedBy': 'Brain Cross'
                            }
                          ]
                        }
                       ";
             var results = ser.DeSerialize(con);
             Logger.Debug("Exitinging CreateContent");
             return results;
         }

         /// <summary>
         /// GetContentMasterData with given details
         /// </summary>
         /// <param name="ContentDetails"></param>
         /// <returns></returns>
         public object GetContentMasterData(List<Content> ContentDetails)
         {
             Logger.Debug("Entering GetContentMasterData");
             JsonNetSerialization ser = new JsonNetSerialization();
             string con = @"{
                          ' Data': 'Book',
                          ' Data': 'Course',
                          ' Data': 'Web page'
                        }";
             var results = ser.DeSerialize(con);
             Logger.Debug("Exitinging GetContentMasterData");
             return results;
         }

         /// <summary>
         /// SearchContents with given details
         /// </summary>
         /// <param name="searchText"></param>
         /// <param name="pageNumber"></param>
         /// <param name="pageSize"></param>
         /// <param name="orderBy"></param>
         /// <returns></returns>
         public object SearchContents(string searchText, int pageNumber, int pageSize, string orderBy)
         {
             Logger.Debug("Entering GetContentMasterData");
             JsonNetSerialization ser = new JsonNetSerialization();
             string con = @"{
	                            'total': 27,
	                            'start': 1,
	                            'page-length': 10,
	                            'results': [{
		                            'Title': 'Myers 11e EPUB3',
		                            'uri': '/mydocuments/conent1.xml',
		                            'path': 'fn:doc(\'/mydocuments/conent1.xml\')',
		                            'href': '/v1/documents?uri=%2Fmydocuments%2Fconent1.xml',
		                            'mimetype': 'application/xml',
		                            'format': 'xml',
		                            'fileName': 'myers113.epub',
		                            'dateLastModified': '2015-04-15 13:30',
		                            'username': 'bcross',
		                            'fullName': 'Brian Cross'

	                            }, {
		                            'Title': 'Myers 11e EPUB3-2',
		                            'uri': '/mydocuments/conent2.xml',
		                            'path': 'fn:doc(\'/mydocuments/conent2.xml\')',
		                            'href': '/v1/documents?uri=%2Fmydocuments%2Fconent2.xml',
		                            'mimetype': 'application/xml',
		                            'format': 'xml',
		                            'fileName': 'myers113.epub',
		                            'dateLastModified': '2015-04-15 13:30',
		                            'username': 'bcross',
		                            'fullName': 'Brian Cross'

	                            }, {
		                            'Title': 'Myers 11e EPUB3-3',
		                            'uri': '/mydocuments/conent3.xml',
		                            'path': 'fn:doc(\'/mydocuments/conent3.xml\')',
		                            'href': '/v1/documents?uri=%2Fmydocuments%2Fconent3.xml',
		                            'mimetype': 'application/xml',
		                            'format': 'xml',
		                            'fileName': 'myers113.epub',
		                            'dateLastModified': '2015-04-15 13:30',
		                            'username': 'bcross',
		                            'fullName': 'Brian Cross'

	                            }, {
		                            'Title': 'Myers 11e EPUB4-4',
		                            'uri': '/mydocuments/conent4.xml',
		                            'path': 'fn:doc(\'/mydocuments/conent4.xml\')',
		                            'href': '/v1/documents?uri=%2Fmydocuments%2Fconent4.xml',
		                            'mimetype': 'application/xml',
		                            'format': 'xml',
		                            'fileName': 'myers113.epub',
		                            'dateLastModified': '2015-04-15 13:30',
		                            'username': 'bcross',
		                            'fullName': 'Brian Cross'

	                            }],
	                            'facets': {
		                            'projectState': {
			                            'type': 'xs:string',
			                            'facetValues': [{
				                            'name': 'Active',
				                            'count': 12,
				                            'value': 'Active'
			                            }, {
				                            'name': '',
				                            'count': 1,
				                            'value': ''
			                            }]
		                            },
		                            'Projects': {
			                            'type': 'xs:string',
			                            'facetValues': [{
				                            'name': 'Hockenbury 5e',
				                            'count': 4,
				                            'value': 'Hockenbury 5e'
			                            }]
		                            },
		                            'Subjects': {
			                            'type': 'xs:string',
			                            'facetValues': [{
				                            'name': 'Psychology',
				                            'count': 13,
				                            'value': 'Psychology'
			                            }]
		                            }
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
                            ";
             var results = ser.DeSerialize(con);
             Logger.Debug("Exitinging GetContentMasterData");
             return results;
         }
    }
}

using Macmillan.CMS.Common;
using Macmillan.CMS.Common.Logging;
using Macmillan.CMS.Common.Models;
using Marklogic.Xcc;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
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

             //Content content = new Content();

             //content.Title = "Myers 11e EPUB3";
             //content.ContentUri = "/mydocuments/conent1.xml";
             //content.Description = "The EPUB3/EDUPUB of David";
             //content.Source = "Book";
             //content.Creator = new string[] { "David Myers" };
             //content.Publisher = "Worth Publishers";
             //content.ContentState = "Vendor";
             //content.Projects = null;
             //content.SubjectHeadings = new string[] { "Psychology" };
             //content.SubjectKeywords = new string[] { "Test", "Working" };
             //content.SystemId = "05b8825669ae9dee519349e4a9edafca";
             //content.DateCreated = DateTime.Now;
             //content.DateModified = DateTime.Now;
             //content.DatePublished = DateTime.Now;
             //content.CreatedBy = "bcross";
             //content.ModifiedBy = "bcross";
             //content.ContentResourceType = "";
             //content.FileFormat = "EPUB";
             //content.FileName = "myers11e.epub";
             //content.FilePath = "s3://cms/myers11e.epub";
             //content.FileSize = "45400";

             //content.AuditInfo = new string[] { "1", "2" };           

             
             //content.ActionType = new string[] { "Upload", "Downloaded" };
           
             //foreach (string AuditInfo in content.ActionType)
             //{
             //    return AuditInfo;
             //}
             //content.ActionCreatedOn = new string[] { "2015-04-15 13:30", "2015-04-15 13:30" };
             //content.ActionCreatedBy = new string[] { "Brian Cross", "Cross" };


             string con = @"{'SystemId':'d44d8cd98f00b204e9800998ecf8427e','ContentUri':'/documents/content4.xml','Path':'fn:doc(\'/documents/content4.xml\')','FileName':'Jouve-MyersEPCH10e_Ch03_20160217.zip','FileFormat':'ZIP','FilePath':'s3://cms/Jouve-MyersEPCH10e_Ch03_20160217.zip','FileSize':'8192','DateCreated':'2015-04-15 13:30','DateModified':'2015-04-15 13:30','CreatedBy':'Brian Cross','ModifiedBy':'Brian Cross','Title':'Myers 11e EPUB3','Description':'Content description','ContentState':'Active','Source':'Book','Creator':['David Myers','Brain Cross'],'Publisher':'Worth Publishers','DatePublished':'2015-04-15 13:30','contentResourceTypes':'Section','SubjectHeadings':['Psychology'],'SubjectKeywords':['Test File'],'Projects':[{
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

	                            }],'AuditInfo':[{'ActionType':'Upload','ActionCreatedOn':'2015-04-15 13:30','ActionCreatedBy':'Brain Cross','ActionNote':'Review of zip file'},{'ActionType':'Downloaded','ActionCreatedOn':'2015-04-15 13:30','ActionCreatedBy':'Brain Cross','ActionNote':'Downloaded zip file'}]}";
             //var results = ser.Serialize<Content>(con);
             var results = ser.DeSerialize(con);
             Logger.Debug("Exitinging CreateContent");
             return results;
         }

         /// <summary>
         /// GetContentMasterData with given details
         /// </summary>
         /// <param name="ContentDetails"></param>
         /// <returns></returns>
         public object GetContentMasterData(List<Macmillan.CMS.Common.Models.Content> ContentDetails)
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

         public void UploadFiles(FileInfo[] file)
         {
             ContentCreateOptions options = null;
             Session session = null;

             try
             {                 
                 Uri uri = new Uri(ConfigurationManager.AppSettings["XCC_Connection"]);
                 ContentSource cs = ContentSourceFactory.NewContentSource(uri);
                 session = cs.NewSession();

                 this.Load(session, file, options);
             }
             catch (Exception ex)
             {
                 CMSException excption = new CMSException(ex.Message, ex);
                 throw excption;
             }
             finally
             {
                 session.Close();
             }
         }

         private void Load(Session session, FileInfo[] files, ContentCreateOptions options)
         {
             String[] uris = new String[files.Length];

             for (int i = 0; i < files.Length; i++)
             {
                 uris[i] = files[i].FullName.Replace("\\", "/");
             }

             Marklogic.Xcc.Content[] contents = new Marklogic.Xcc.Content[files.Length];

             for (int i = 0; i < files.Length; i++)
             {
                 contents[i] = ContentFactory.NewContent("documents/" + files[i].Name, files[i], options);
             }

             session.InsertContent(contents);
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
		                            'Title': 'Myers 11e EPUB3-1',
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

	                            },{
		                            'Title': 'Myers 11e EPUB4-5',
		                            'uri': '/mydocuments/conent4.xml',
		                            'path': 'fn:doc(\'/mydocuments/conent4.xml\')',
		                            'href': '/v1/documents?uri=%2Fmydocuments%2Fconent4.xml',
		                            'mimetype': 'application/xml',
		                            'format': 'xml',
		                            'fileName': 'myers113.epub',
		                            'dateLastModified': '2015-04-15 13:30',
		                            'username': 'bcross',
		                            'fullName': 'Brian Cross'

	                            },
{
		                            'Title': 'Myers 11e EPUB4-6',
		                            'uri': '/mydocuments/conent4.xml',
		                            'path': 'fn:doc(\'/mydocuments/conent4.xml\')',
		                            'href': '/v1/documents?uri=%2Fmydocuments%2Fconent4.xml',
		                            'mimetype': 'application/xml',
		                            'format': 'xml',
		                            'fileName': 'myers113.epub',
		                            'dateLastModified': '2015-04-15 13:30',
		                            'username': 'bcross',
		                            'fullName': 'Brian Cross'

	                            },
{
		                            'Title': 'Myers 11e EPUB4-7',
		                            'uri': '/mydocuments/conent4.xml',
		                            'path': 'fn:doc(\'/mydocuments/conent4.xml\')',
		                            'href': '/v1/documents?uri=%2Fmydocuments%2Fconent4.xml',
		                            'mimetype': 'application/xml',
		                            'format': 'xml',
		                            'fileName': 'myers113.epub',
		                            'dateLastModified': '2015-04-15 13:30',
		                            'username': 'bcross',
		                            'fullName': 'Brian Cross'

	                            },
{
		                            'Title': 'Myers 11e EPUB4-8',
		                            'uri': '/mydocuments/conent4.xml',
		                            'path': 'fn:doc(\'/mydocuments/conent4.xml\')',
		                            'href': '/v1/documents?uri=%2Fmydocuments%2Fconent4.xml',
		                            'mimetype': 'application/xml',
		                            'format': 'xml',
		                            'fileName': 'myers113.epub',
		                            'dateLastModified': '2015-04-15 13:30',
		                            'username': 'bcross',
		                            'fullName': 'Brian Cross'

	                            },
{
		                            'Title': 'Myers 11e EPUB4-9',
		                            'uri': '/mydocuments/conent4.xml',
		                            'path': 'fn:doc(\'/mydocuments/conent4.xml\')',
		                            'href': '/v1/documents?uri=%2Fmydocuments%2Fconent4.xml',
		                            'mimetype': 'application/xml',
		                            'format': 'xml',
		                            'fileName': 'myers113.epub',
		                            'dateLastModified': '2015-04-15 13:30',
		                            'username': 'bcross',
		                            'fullName': 'Brian Cross'

	                            },{
		                            'Title': 'Myers 11e EPUB4-10',
		                            'uri': '/mydocuments/conent4.xml',
		                            'path': 'fn:doc(\'/mydocuments/conent4.xml\')',
		                            'href': '/v1/documents?uri=%2Fmydocuments%2Fconent4.xml',
		                            'mimetype': 'application/xml',
		                            'format': 'xml',
		                            'fileName': 'myers113.epub',
		                            'dateLastModified': '2015-04-15 13:30',
		                            'username': 'bcross',
		                            'fullName': 'Brian Cross'

	                            },{
		                            'Title': 'Myers 11e EPUB4-11',
		                            'uri': '/mydocuments/conent4.xml',
		                            'path': 'fn:doc(\'/mydocuments/conent4.xml\')',
		                            'href': '/v1/documents?uri=%2Fmydocuments%2Fconent4.xml',
		                            'mimetype': 'application/xml',
		                            'format': 'xml',
		                            'fileName': 'myers113.epub',
		                            'dateLastModified': '2015-04-15 13:30',
		                            'username': 'bcross',
		                            'fullName': 'Brian Cross'

	                            },{
		                            'Title': 'Myers 11e EPUB4-12',
		                            'uri': '/mydocuments/conent4.xml',
		                            'path': 'fn:doc(\'/mydocuments/conent4.xml\')',
		                            'href': '/v1/documents?uri=%2Fmydocuments%2Fconent4.xml',
		                            'mimetype': 'application/xml',
		                            'format': 'xml',
		                            'fileName': 'myers113.epub',
		                            'dateLastModified': '2015-04-15 13:30',
		                            'username': 'bcross',
		                            'fullName': 'Brian Cross'

	                            },{
		                            'Title': 'Myers 11e EPUB4-13',
		                            'uri': '/mydocuments/conent4.xml',
		                            'path': 'fn:doc(\'/mydocuments/conent4.xml\')',
		                            'href': '/v1/documents?uri=%2Fmydocuments%2Fconent4.xml',
		                            'mimetype': 'application/xml',
		                            'format': 'xml',
		                            'fileName': 'myers113.epub',
		                            'dateLastModified': '2015-04-15 13:30',
		                            'username': 'bcross',
		                            'fullName': 'Brian Cross'

	                            },{
		                            'Title': 'Myers 11e EPUB4-14',
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

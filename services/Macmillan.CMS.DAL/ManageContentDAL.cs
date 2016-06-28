﻿using Macmillan.CMS.Common;
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
         public object UploadMetadata(string metadata)
         {
             Logger.Debug("Entering UploadMetadata");

             string mlUrl = ConfigurationManager.AppSettings["MarkLogicResourceURL"] + "content?name=content";
             MLReader mlReader = new MLReader();            
             string results = mlReader.HttpInvoke(mlUrl, SupportedHttpMethods.POST, "application/json", metadata);            
             Logger.Debug("Exiting UploadMetadata");
             return results;
         }
         
         /// <summary>
         /// UpdateContent with given details
         /// </summary>
         /// <param name="content"></param>
         /// <returns></returns>
         public object UpdateContent(string projJson, string projUri)
         {
             Logger.Debug("Entering UpdateProject");
             //Call ML and Put the project xml
             string mlUrl = ConfigurationManager.AppSettings["MarkLogicResourceURL"] + "content?name=content&rs:format=json&rs:uri=" + projUri;
             MLReader mlReader = new MLReader();
             string  results = mlReader.HttpInvoke(mlUrl, SupportedHttpMethods.PUT, "application/json", projJson);

             Logger.Debug("Exitinging UpdateProject");
             return mlReader.ConverttoJson<object>(results);
         }

         /// <summary>
         /// content with given details
         /// </summary>
         /// <param name="content"></param>
         /// <returns></returns>
         public object DeleteContent(string projUri)
         {
              Logger.Debug("Entry DeleteProject");
              //Call ML and Put the project xml
              string mlUrl = ConfigurationManager.AppSettings["MarkLogicResourceURL"] + "content?name=content&rs:uri=" + projUri;
              MLReader mlReader = new MLReader();
              string results = mlReader.HttpInvoke(mlUrl, SupportedHttpMethods.DELETE, "application/json");
             Logger.Debug("Exiting DeleteProject");
             return mlReader.ConverttoJson<object>(results);
         }

         /// <summary>
         /// GetContent with given details
         /// </summary>
         /// <param name="docUri"></param>
         /// <returns></returns>
         public object GetContent(string uri)
         {
             Logger.Debug("Entering GetContent");
             //MLReader mlReader = new MLReader();
             //string mlUrl = ConfigurationManager.AppSettings["MarkLogicResourceURL"] + "content?name=content&rs:format=json&rs:uri=" + uri;
             //object results = null;
             //try
             //{
             //    results = mlReader.GetHttpContent<object>(mlUrl, "application/json");
             //}
             //catch (Exception ex)
             //{
             //    //{"responseCode":"401","message":"User/Pass incorrect"}

             //    if (ex.Message.Contains("401"))
             //    {
             //        var error = new { responseCode = "401", message = "401 Unauthorized" };

             //        results = error;
             //    }
             //}

             //Logger.Debug("Exitinging CreateContent");
             //return results;

             JsonNetSerialization ser = new JsonNetSerialization();
             Macmillan.CMS.Common.Models.Content content = new Macmillan.CMS.Common.Models.Content();
             content.Title = "Myers 11e EPUB3";
             content.ContentUri = "/content/6856399037435776046.xml";
             content.Description = "The EPUB3/EDUPUB of David";
             content.Source = "Book";
             content.Creator = new string[] { "David Myers" };
             content.Publisher = "Hayden-McNeil";
             content.ContentState = "Enhanced";
             content.Projects = null;
             content.SubjectHeadings = new string[] { "Psychology" };
             content.SubjectKeywords = new string[] { "Psychology" };
             content.SystemId = "ce80de420db4464f879dfbd47dc27fb2";
             content.DateCreated = DateTime.Now;
             content.DateModified = DateTime.Now;
             content.DatePublished = DateTime.Now;
             content.CreatedBy = "bcross";
             content.ModifiedBy = "bcross";
             content.ContentResourceType = "";
             content.FileFormat = "EPUB";
             content.FileName = "myers11e.epub";
             content.FilePath = "s3://cms/myers11e.epub";
             content.FileSize = "45400";
             Logger.Debug("Exitinging CreateContent");
             return content;
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

         public void UploadFile(FileInfo file)
         {
             this.HTTPUpload(file);
         }

         private void HTTPUpload(FileInfo file)
         {
             string mlUrl = ConfigurationManager.AppSettings["MarkLogicResourceURL"] + "file?name=file&rs:fileName=" + file.Name;
             MLReader mlReader = new MLReader();
             string results = mlReader.UploadFile(mlUrl, "image/jpeg", file.FullName);
         }

         private void XCCUpload(FileInfo file)
         {
             ContentCreateOptions options = null;
             Session session = null;

             try
             {
                 //Uri uri = new Uri("xcc://admin:admin@localhost:8061/Documents");
                 //Uri uri = new Uri("xcc://admin:admin@localhost:8061/mml-cms-app-content");
                 Uri uri = new Uri(ConfigurationManager.AppSettings["XCC_Connection"]);
                 ContentSource cs = ContentSourceFactory.NewContentSource(uri);
                 session = cs.NewSession();

                 // FileInfo[] file = new FileInfo[2] { 
                 //new FileInfo(@"E:\MacMillan\CMS\working\stubs\UploadFile\UploadFile\app_data\project1.xml"),
                 //new FileInfo(@"E:\MacMillan\CMS\working\stubs\UploadFile\UploadFile\app_data\project2.xml")};

                 this.LoadFile(session, file, options);
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

         private void LoadFiles(Session session, FileInfo[] files, ContentCreateOptions options)
         {
             String[] uris = new String[files.Length];

             for (int i = 0; i < files.Length; i++)
             {
                 uris[i] = files[i].FullName.Replace("\\", "/");
             }

             Marklogic.Xcc.Content[] contents = new Marklogic.Xcc.Content[files.Length];

             for (int i = 0; i < files.Length; i++)
             {
                 contents[i] = ContentFactory.NewContent("documents/binary/" + files[i].Name, files[i], options);
             }

             session.InsertContent(contents);
         }

         private void LoadFile(Session session, FileInfo file, ContentCreateOptions options)
         {
             String uris = file.FullName.Replace("\\", "/");

             Marklogic.Xcc.Content content = ContentFactory.NewContent("documents/binary/" + file.Name, file , options); 

             session.InsertContent(content);
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

using Macmillan.CMS.Common;
using Macmillan.CMS.Common.Logging;
using Macmillan.CMS.Common.Models;
using Marklogic.Xcc;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
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
             MLReader mlReader = new MLReader();
             string mlUrl = ConfigurationManager.AppSettings["MarkLogicResourceURL"] + "content?name=content&rs:format=json&rs:uri=" + uri;
             object results = null;
             try
             {
                 results = mlReader.GetHttpContent<object>(mlUrl, "application/json");
             }
             catch (Exception ex)
             {                
                 if (ex.Message.Contains("401"))
                 {
                     var error = new { responseCode = "401", message = "401 Unauthorized" };

                     results = error;
                 }
             }

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
                 Uri uri = new Uri(ConfigurationManager.AppSettings["XCC_Connection"]);
                 ContentSource cs = ContentSourceFactory.NewContentSource(uri);
                 session = cs.NewSession();              

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
             MLReader mlReader = new MLReader();
             string mlUrl = ConfigurationManager.AppSettings["MarkLogicResourceURL"] + "content?name=content&rs:format=json" ;
             object results = null;
             try
             {
                 results = mlReader.GetHttpContent<object>(mlUrl, "application/json");
             }
             catch (Exception ex)
             {                

                 if (ex.Message.Contains("401"))
                 {
                     var error = new { responseCode = "401", message = "401 Unauthorized" };

                     results = error;
                 }
             }

             Logger.Debug("Exitinging CreateContent");
             return results;
         }


         /// <summary>
         /// DownloadContent with given details
         /// </summary>
         /// <param name="filePath"></param>
         /// <returns></returns>
         public HttpResponseMessage DownloadContent(string uri)
         {

             Logger.Debug("Entering GetContent");
             MLReader mlReader = new MLReader();
             string fileName = "Jouve-MyersEPCH1.epub";
             string mlUrl = ConfigurationManager.AppSettings["MarkLogicResourceURL"] + "file?name=file&rs:format=json&rs:uri=/file/"+uri;
             HttpResponseMessage results = null;
             try
             {
                 results = mlReader.DownloadFile(mlUrl, "application/json", uri);
             }
             catch (Exception ex)
             {
                 Logger.Debug("Exception",ex);                 
             }

             Logger.Debug("Exitinging CreateContent");
             return results;                  
       }

         private static byte[] ReadFully(Stream input)
         {
             byte[] buffer = new byte[16 * 1024];
             using (MemoryStream ms = new MemoryStream())
             {
                 int read;
                 while ((read = input.Read(buffer, 0, buffer.Length)) > 0)
                 {
                     ms.Write(buffer, 0, read);
                 }
                 return ms.ToArray();
             }
         }
    }
}

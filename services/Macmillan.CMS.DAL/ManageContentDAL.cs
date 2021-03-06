﻿using Macmillan.CMS.Common;
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
         string uploadFileLocation = ConfigurationManager.AppSettings["uploadFileLocation"].ToString();

         /// <summary>
        /// CreateContent with given details
         /// </summary>
         /// <param name="content"></param>
         /// <returns></returns>
         public object UploadMetadata(string metadata)
         {
             Logger.Info("Entering UploadMetadata");

             string mlUrl = ConfigurationManager.AppSettings["MarkLogicResourceURL"] + "content?name=content";
             MLReader mlReader = new MLReader();            
             string results = mlReader.HttpInvoke(mlUrl, SupportedHttpMethods.POST, "application/json", metadata);
             Logger.Debug("Logging results for UploadMetadata with mlUrl");
             Logger.Info("Exiting UploadMetadata");
             return mlReader.ConverttoJson<object>(results); 
         }
         
         /// <summary>
         /// UpdateContent with given details
         /// </summary>
         /// <param name="content"></param>
         /// <returns></returns>
         public object UpdateContent(string projJson, string projUri)
         {
             Logger.Info("Entering UpdateProject");
             //Call ML and Put the project xml
             string mlUrl = ConfigurationManager.AppSettings["MarkLogicResourceURL"] + "content?name=content&rs:format=json&rs:uri=" + projUri;
             MLReader mlReader = new MLReader();
             string  results = mlReader.HttpInvoke(mlUrl, SupportedHttpMethods.PUT, "application/json", projJson);
             Logger.Debug("Logging results for UpdateContent with mlUrl");
             Logger.Info("Exitinging UpdateProject");
             return mlReader.ConverttoJson<object>(results);
         }

         /// <summary>
         /// content with given details
         /// </summary>
         /// <param name="content"></param>
         /// <returns></returns>
         public object DeleteContent(string projUri)
         {
             Logger.Info("Entering DeleteProject");
              //Call ML and Put the project xml
              string mlUrl = ConfigurationManager.AppSettings["MarkLogicResourceURL"] + "content?name=content&rs:uri=" + projUri;
              MLReader mlReader = new MLReader();
              string results = mlReader.HttpInvoke(mlUrl, SupportedHttpMethods.DELETE, "application/json");
              Logger.Debug("Logging results for DeleteContent with mlUrl");
              Logger.Info("Exiting DeleteProject");
             return mlReader.ConverttoJson<object>(results);
         }

         /// <summary>
         /// GetContent with given details
         /// </summary>
         /// <param name="docUri"></param>
         /// <returns></returns>
         public object GetContent(string uri)
         {
             Logger.Info("Entering GetContent");
             MLReader mlReader = new MLReader();
             string mlUrl = ConfigurationManager.AppSettings["MarkLogicResourceURL"] + "content?name=content&rs:format=json&rs:uri=" + uri;
             object results = null;
             try
             {
                 Logger.Debug("Logging for GetContent with mlUrl");
                 results = mlReader.GetHttpContent<object>(mlUrl, "application/json");
             }
             catch (Exception ex)
             {                
                 if (ex.Message.Contains("401"))
                 {
                     var error = new { responseCode = "401", message = "Error 401 - Unauthorized: Access is denied." };
                     Logger.Error("Error message for GetContentDal");
                     results = error;
                 }
             }

             Logger.Info("Exitinging CreateContent");
             return results;         
         }

         /// <summary>
         /// GetContentMasterData with given details
         /// </summary>
         /// <param name="ContentDetails"></param>
         /// <returns></returns>
         public object GetContentMasterData(List<Macmillan.CMS.Common.Models.Content> ContentDetails)
         {
             Logger.Info("Entering GetContentMasterData");
             JsonNetSerialization ser = new JsonNetSerialization();
             string con = @"{
                          ' Data': 'Book',
                          ' Data': 'Course',
                          ' Data': 'Web page'
                        }";
             var results = ser.DeSerialize(con);
             Logger.Debug("Logging for GetContentMasterData with JsonNetSerialization");
             Logger.Info("Exitinging GetContentMasterData");
             return results;
         }

         public void UploadFile(FileInfo file)
         {
             Logger.Info("Entering UploadFile");
            // this.HTTPUpload(file);
             this.XCCUpload(file);
         }

         private void HTTPUpload(FileInfo file)
         {
             string mlUrl = ConfigurationManager.AppSettings["MarkLogicResourceURL"] + "file?name=file&rs:fileName=" + file.Name;
             MLReader mlReader = new MLReader();
             string results = mlReader.UploadFile(mlUrl, "image/jpeg", file.FullName);
         }

         private void XCCUpload(FileInfo file)
         {
             Logger.Info("Entering XCCUpload");
             ContentCreateOptions options = null;
             Session session = null;

             try
             {                
                 Uri uri = new Uri(ConfigurationManager.AppSettings["XCC_Connection"]);
                 ContentSource cs = ContentSourceFactory.NewContentSource(uri);
                 session = cs.NewSession();
                 Logger.Debug("Logging results for ContentSource");
                 this.LoadFile(session, file, options);
             }
             catch (Exception ex)
             {
                 CMSException excption = new CMSException(ex.Message, ex);
                 Logger.Error("Error on XCCUpload" + ex.Message);
                 throw excption;
             }
             finally
             {
                 session.Close();
             }
         }

         private void LoadFiles(Session session, FileInfo[] files, ContentCreateOptions options)
         {
             Logger.Info("Entering LoadFiles");
             String[] uris = new String[files.Length];
            

             for (int i = 0; i < files.Length; i++)
             {
                 uris[i] = files[i].FullName.Replace("\\", "/");
             }

             Marklogic.Xcc.Content[] contents = new Marklogic.Xcc.Content[files.Length];

             for (int i = 0; i < files.Length; i++)
             {
                 contents[i] = ContentFactory.NewContent(uploadFileLocation + files[i].Name, files[i], options);
             }

             session.InsertContent(contents);
             Logger.Info("Content inserted successfully");
         }

         private void LoadFile(Session session, FileInfo file, ContentCreateOptions options)
         {
             Logger.Info("Entering LoadFiles");
             String uris = file.FullName.Replace("\\", "/");

             Marklogic.Xcc.Content content = ContentFactory.NewContent(uploadFileLocation + file.Name, file, options);

            
             session.InsertContent(content);
             Logger.Info("Content inserted successfully");
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
             Logger.Info("Entering GetContentMasterData");
             MLReader mlReader = new MLReader();
             searchText = System.Web.HttpContext.Current.Server.UrlEncode(searchText);
             string mlUrl = ConfigurationManager.AppSettings["MarkLogicResourceURL"] + "content?name=content&rs:format=json" ;
             object results = null;
             try
             {
                 results = mlReader.GetHttpContent<object>(mlUrl, "application/json");
                 Logger.Debug("Logging results for mlReader with json");
             }
             catch (Exception ex)
             {                

                 if (ex.Message.Contains("401"))
                 {
                     var error = new { responseCode = "401", message = "Error 401 - Unauthorized: Access is denied." };
                     Logger.Error("Error Message for SearchContentsDal with mlUrl");
                     results = error;
                 }
             }

             Logger.Info("Exitinging CreateContent");
             return results;
         }


         /// <summary>
         /// DownloadContent with given details
         /// </summary>
         /// <param name="filePath"></param>
         /// <returns></returns>
         public HttpResponseMessage DownloadContent(string uri)
         {

             Logger.Info("Entering GetContent");
             MLReader mlReader = new MLReader();

             string mlUrl = ConfigurationManager.AppSettings["MarkLogicResourceURL"] + "file?name=file&rs:format=json&rs:uri=" + uploadFileLocation + uri;
             HttpResponseMessage results = null;
             try
             {
                 results = mlReader.DownloadFile(mlUrl, "application/json", uri);
                 Logger.Debug("Logging results for DownloadFile with mlReader uri");
             }
             catch (Exception ex)
             {
                 Logger.Debug("Exception",ex);                 
             }

             Logger.Info("Exitinging CreateContent");
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

using Macmillan.CMS.Common.Logging;
using Macmillan.CMS.Common.Models;
using Macmillan.CMS.DAL;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Macmillan.CMS.Business
{
     public class ManageContentBusiness : IManageContentBusiness
    {
         IManageContentDAL dal;
         /// <summary>
         ///  ManageContentBusiness dependency injection
         /// </summary>
         /// <param name="ManageContentDAL"></param>
         public ManageContentBusiness(IManageContentDAL ManageContentDAL)
         {
             this.dal = ManageContentDAL;
         }

         /// <summary>
         /// CreateContent with given details
         /// </summary>
         /// <param name="content"></param>
         /// <returns></returns>
         public object UploadMetadata(Content content, FileInfo file)
        {
            Logger.Debug(" Entering UploadMetadata");

            string metaData = this.BuildContentMetadataJson(content, file);

            this.dal.UploadMetadata(metaData);

            Logger.Debug(" Exiting UploadMetadata");

            var results = new { Title = content.Title, uri = "/content/" + content.Title };

            return results;
        }

         /// <summary>
         /// UpdateContent with given details
         /// </summary>
         /// <param name="content"></param>
         /// <returns></returns>
         public object UpdateContent(string projXml, string projUri)
        {
            Logger.Debug(" Entering UpdateContent");
            var results = this.dal.UpdateContent(projXml, projUri);
            Logger.Debug(" Exiting UpdateContent");
            return results;
        }

         /// <summary>
         /// DeleteContent with given details
         /// </summary>
         /// <param name="content"></param>
         /// <returns></returns>
         public object DeleteContent(string projXml, string projUri)
        {
            Logger.Debug(" Entering DeleteProject");
            var results = this.dal.DeleteContent(projXml, projUri);
            Logger.Debug(" Exiting DeleteProject");
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
            var results = this.dal.GetContent(docUri);
            Logger.Debug("Exiting GetContent");
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
            var results = this.dal.GetContentMasterData(ContentDetails);
            Logger.Debug("Exiting GetContentMasterData");
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
            Logger.Debug("Entering SearchContents");
            var results = this.dal.SearchContents(searchText, pageNumber, pageSize, orderBy);
            Logger.Debug("Exiting SearchContents");
            return results;
        }

         public void UploadFile(FileInfo file)
         {
             this.dal.UploadFile(file);
         }

         /// <summary>
         /// BuildProjectXML with given details
         /// </summary>
         /// <param name="project"></param>
         /// <returns></returns>
         private string BuildContentMetadataJson(Content content, FileInfo fileInfo)
         {
             Logger.Debug(" Entering BuildContentMetadataJson");

             StringBuilder text = new StringBuilder(File.ReadAllText(ConfigurationManager.AppSettings["AppDataPath"] + "\\Content.json"));

             text.Replace("##systemId##", Guid.NewGuid().ToString("N").Substring(0, 32));

             if (content.SubjectHeadings != null)
             {
                 StringBuilder subjects = new StringBuilder();

                 foreach (string subject in content.SubjectHeadings)
                 {
                     if(!string.IsNullOrEmpty(subjects.ToString()))
                         subjects.Append(",");

                     subjects.Append("\"" + subject + "\"");
                 }
                 text.Replace("##subjectHeadings##", subjects.ToString());
             }

             if (content.SubjectKeywords != null)
             {
                 StringBuilder keywords = new StringBuilder();

                 foreach (string keyword in content.SubjectKeywords)
                 {
                     if (!string.IsNullOrEmpty(keywords.ToString()))
                         keywords.Append(",");

                     keywords.Append("\"" + keyword + "\"");
                 }

                 text.Replace("##subjectKeywords##", keywords.ToString());
             }

             if (content.Projects != null)
             {
                 StringBuilder projects = new StringBuilder();

                 foreach (string project in content.Projects)
                 {
                     if (!string.IsNullOrEmpty(projects.ToString()))
                         projects.Append(",");

                     projects.Append("\"" + project + "\"");
                 }

                 text.Replace("##projects##", projects.ToString());
             }

             text.Replace("##title##", content.Title);
             text.Replace("##description##", content.Description);
             text.Replace("##source##", content.Source);
             text.Replace("##publisher##", content.Publisher);
             text.Replace("##datePublished##", content.DatePublished.ToString());
             text.Replace("##contentState##", content.ContentState);
             
             if (content.Creator != null)
             {
                 StringBuilder creators = new StringBuilder();

                 foreach (string creator in content.Creator)
                 {
                     if (!string.IsNullOrEmpty(creators.ToString()))
                         creators.Append(",");

                     creators.Append("\"" + creator + "\"");
                 }

                 text.Replace("##creators##", creators.ToString());
             }


             ////if (fileInfo != null) 
             ////{
             ////    StringBuilder resources = new StringBuilder();

             ////    foreach (FileInfo file in fileInfo)
             ////    {
             ////        if (!string.IsNullOrEmpty(resources.ToString()))
             ////            resources.Append(",");

             ////        resources.Append(file);
             ////    }

             ////    text.Replace("##resources##", resources.ToString());
             ////}

             text.Replace("##fileFormat##", fileInfo.Extension);
             text.Replace("##fileName##", fileInfo.Name);
             text.Replace("##filePath##", "resources/" + fileInfo.Name);
             text.Replace("##fileSize##", fileInfo.Length.ToString());

             Logger.Debug(" Exiting BuildContentMetadataJson");
             return text.ToString();
         }
    }
}

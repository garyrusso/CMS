using Macmillan.CMS.Common.Logging;
using Macmillan.CMS.Common.Models;
using Macmillan.CMS.DAL;
using System;
using System.Collections.Generic;
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
         public object CreateContent(string projXml, string projUri)
        {
            Logger.Debug(" Entering CreateProject");
            var resutls = this.dal.CreateContent(projXml, projUri);
            Logger.Debug(" Exiting CreateProject");
            return resutls;
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
    }
}

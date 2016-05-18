using Macmillan.CMS.Business;
using Macmillan.CMS.Common.Logging;
using Macmillan.CMS.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Macmillan.CMS.Service.Controllers
{
    public class ManageContentsController : ApiController
    {
        IManageContentBusiness business;
        /// <summary>
        ///  ManageContentsController dependency injection
        /// </summary>
        /// <param name="ManageContentBusiness"></param>
        public ManageContentsController(IManageContentBusiness ManageContentBusiness)
        {
            this.business = ManageContentBusiness;
        }

        /// <summary>
        /// CreateContent with given details
        /// </summary>
        /// <param name="content"></param>
        /// <returns></returns>       
        [HttpPost]
        public object CreateContent (HttpRequestMessage request,
            [FromBody]Content content)
        {
            Logger.Debug("Entering CreateContent");
            var results = this.business.CreateContent(content);
            Logger.Debug("Exiting CreateContent");
            return results;
        }

        /// <summary>
        /// UpdateContent with given details
        /// </summary>
        /// <param name="content"></param>
        /// <returns></returns>
        [HttpPut]
        public object UpdateContent(Content content)
        {
            Logger.Debug("Entering UpdateContent");
            var results = this.business.UpdateContent(content);
            Logger.Debug("Exiting UpdateContent");
            return results;
        }

        /// <summary>
        /// DeleteContent with given details
        /// </summary>
        /// <param name="content"></param>
        /// <returns></returns>
        [HttpDelete]
        public object DeleteContent(HttpRequestMessage request,
            [FromBody]Content content)
        {
            Logger.Debug("Entering DeleteContent");
            var results = this.business.DeleteContent(content);
            Logger.Debug("Exiting DeleteContent");
            return results;
        }

        /// <summary>
        /// GetContent with given details
        /// </summary>
        /// <param name="docUri"></param>
        /// <returns></returns>
        [HttpGet]
        public object GetContent(string docUri)
        {
            Logger.Debug("Entering GetContent");
            var results = this.business.GetContent(docUri);
            Logger.Debug("Exiting GetContent");
            return results;
        }

        /// <summary>
        /// GetContentMasterData with given details
        /// </summary>
        /// <param name="ContentDetails"></param>
        /// <returns></returns>
        [HttpGet]
        public object GetContentMasterData(List<Content> ContentDetails)
        {
            Logger.Debug("Entering GetContentMasterData");
            var results = this.business.GetContentMasterData(ContentDetails);
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
        [HttpGet]
        public object SearchContents(string searchText, int pageNumber, int pageSize, string orderBy)
        {
            Logger.Debug("Entering SearchContents");
            var results = this.business.SearchContents(searchText, pageNumber, pageSize, orderBy);
            Logger.Debug("Exiting SearchContents");
            return results;
        }
    }
}
﻿using Macmillan.CMS.Business;
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
    public class ManageContentController : ApiController
    {
        IManageContentBusiness business;
        /// <summary>
        ///  ManageContentsController dependency injection
        /// </summary>
        /// <param name="ManageContentBusiness"></param>
        public ManageContentController(IManageContentBusiness ManageContentBusiness)
        {
            this.business = ManageContentBusiness;
        }

        /// <summary>
        /// CreateContent with given details
        /// </summary>
        /// <param name="content"></param>
        /// <returns>Returns object for CreateContent</returns>       
        [HttpPost]
        public object CreateContent(HttpRequestMessage request,
            [FromBody] Content content)
        {
            Logger.Debug("Entering CreateContent");
            var results = this.business.GetContent("");
            Logger.Debug("Exiting CreateContent");
            return results;
        }

        /// <summary>
        /// UpdateContent with given details
        /// </summary>
        /// <param name="content"></param>
        /// <returns>Returns object for UpdateContent</returns>
        [HttpPut]
        public object UpdateContent([FromBody] Content content)
        {
            Logger.Debug("Entering UpdateContent");
            var results = this.business.GetContent("");
            Logger.Debug("Exiting UpdateContent");
            return results;
        }

        /// <summary>
        /// DeleteContent with given details
        /// </summary>
        /// <param name="content"></param>
        /// <returns>Returns object for DeleteContent</returns>
        [HttpPost]
        public object DeleteContent([FromBody] Content content)
        {
            Logger.Debug("Entering DeleteContent");
            var results = this.business.GetContent("");
            Logger.Debug("Exiting DeleteContent");
            return results;
        }

        /// <summary>
        /// GetContent with given details
        /// </summary>
        /// <param name="docUri"></param>
        /// <returns>Returns object for GetContent</returns>
        [HttpGet]
        public object GetContentDetails(string uri)
        {
            Logger.Debug("Entering GetContent");
            var results = this.business.GetContent(uri);
            Logger.Debug("Exiting GetContent");
            return results;
        }

        /// <summary>
        /// GetContentMasterData with given details
        /// </summary>
        /// <param name="ContentDetails"></param>
        /// <returns>Returns object for GetContentMasterData</returns>
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
        /// <returns>Returns object for SearchContents</returns>
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
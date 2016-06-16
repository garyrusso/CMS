using Macmillan.CMS.Business;
using Macmillan.CMS.Common.Logging;
using Macmillan.CMS.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.IO;
using POCOLibrary;

using System.Threading.Tasks;
using Macmillan.CMS.Common;


namespace Macmillan.CMS.Service.Controllers
{
    public class ManageContentController : ApiController
    {
        IManageContentBusiness business;
        IDictionaryBusiness dictionaryBusiness;
        //private readonly IFileManagerService _fileManager;
        private readonly IFlowJsRepoBusiness _flowJs;
        const string Folder = @"D:\Temp";

        /// <summary>
        ///  ManageContentsController dependency injection
        /// </summary>
        /// <param name="ManageContentBusiness"></param>
        public ManageContentController(IManageContentBusiness ManageContentBusiness, IDictionaryBusiness dictBusiness)
        {
            this.business = ManageContentBusiness;
            this.dictionaryBusiness = dictBusiness;
            _flowJs = new FlowJsBusiness();
        }

        /// <summary>
        /// UploadFile getmethod for given details
        /// </summary>
        /// <param name="flowChunkNumber"></param>
        /// <param name="flowChunkSize"></param>
        /// <param name="flowCurrentChunkSize"></param>
        /// <param name="flowTotalSize"></param>
        /// <param name="flowIdentifier"></param>
        /// <param name="flowFilename"></param>
        /// <param name="flowRelativePath"></param>
        /// <param name="flowTotalChunks"></param>
        /// <returns>Returns object for UploadFile details </returns>
        [HttpGet]
        [Route("Upload")]
        public async Task<IHttpActionResult> UploadFile(string flowChunkNumber,
            string flowChunkSize,
            string flowCurrentChunkSize,
            string flowTotalSize,
            string flowIdentifier,
            string flowFilename,
            string flowRelativePath,
            string flowTotalChunks)
        {
            Logger.Debug("Entering GetUploadFile");
            var request = HttpContext.Current.Request;

            var chunkExists = _flowJs.ChunkExists(Folder, request);
            if (chunkExists) return Ok();
            Logger.Debug("Exiting GetUploadFile");
            return ResponseMessage(new HttpResponseMessage(HttpStatusCode.NoContent));
        }


        /// <summary>
        /// UploadFile postmethod with given details
        /// </summary>
        /// <param name="content"></param>
        /// <returns>Returns the status with given details</returns>
        [HttpPost]
        [Route("Upload")]
        public async Task<IHttpActionResult> UploadFile()
        {
            try
            {
                var request = HttpContext.Current.Request;
                                
                var validationRules = new Macmillan.CMS.Common.Models.FlowModels.FlowValidationRules();
                validationRules.MaxFileSize = 500000000;
                var status = _flowJs.PostChunk(request, Folder, validationRules);

                if (status.Status == Macmillan.CMS.Common.Models.FlowModels.PostChunkStatus.Done)
                {                 
                    // file uploade is complete. Below is an example of further file handling
                    var filePath = Path.Combine(Folder, status.FileName);
                    var file = File.ReadAllBytes(filePath);                  
                    return Ok();

                }

                  if (status.Status == Macmillan.CMS.Common.Models.FlowModels.PostChunkStatus.PartlyDone)
                {
                    return Ok();
                }
    
                status.ErrorMessages.ForEach(x => ModelState.AddModelError("file", x));
                 throw new CMSException("hello");
            }
        
            catch (Exception ex)
            {
                Logger.Error(ex);
                return StatusCode(HttpStatusCode.NotFound);
            }
            return Ok();
        }
  
        /// <summary>
        /// CreateContent with given details
        /// </summary>
        /// <param name="content"></param>
        /// <returns></returns>       
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
        /// <returns>Returns object for UpdateContent </returns>
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
        /// <returns>Returns object for GetContentDetails</returns>
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

        /// <summary>
        /// DownloadContent with given details 
        /// </summary>
        /// <returns>Returns object for DownloadContent</returns>
        [Route("download")]
        [HttpGet]
        public HttpResponseMessage DownloadContent()
        {
            Logger.Debug("Entering download");            
            HttpResponseMessage response = Request.CreateResponse();
            FileMetaData metaData = new FileMetaData();
            try
            {                
                string filePath = System.Web.Configuration.WebConfigurationManager.AppSettings["DownLoadPath"];
               // filePath = System.Web.HttpContext.Current.Server.MapPath(filePath);
                FileInfo fileInfo = new FileInfo(filePath);

                if (!fileInfo.Exists)
                {
                    metaData.FileResponseMessage.IsExists = false;
                    metaData.FileResponseMessage.Content = string.Format("{0} file is not found !", fileInfo.Name);
                    response = Request.CreateResponse(HttpStatusCode.NotFound, metaData, new System.Net.Http.Headers.MediaTypeHeaderValue("text/json"));
                }
                else
                {
                    response.Headers.AcceptRanges.Add("bytes");
                    response.StatusCode = HttpStatusCode.OK;
                    response.Content = new StreamContent(fileInfo.OpenRead());
                    response.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
                    response.Content.Headers.ContentDisposition.FileName = fileInfo.Name;
                    response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/octet-stream");
                    response.Content.Headers.ContentLength = fileInfo.Length;
                }
            }
            catch (Exception exception)
            {
                Logger.Debug("Exception " + exception);
            }
            Logger.Debug("Exiting download");
            return response;            
        }
    }
}

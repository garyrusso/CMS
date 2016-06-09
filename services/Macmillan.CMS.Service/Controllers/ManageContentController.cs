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
//using Macmillan.CMS.Service.FlowJs;
using System.IO;
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
            var request = HttpContext.Current.Request;

            var chunkExists = _flowJs.ChunkExists(Folder, request);
            if (chunkExists) return Ok();
            return ResponseMessage(new HttpResponseMessage(HttpStatusCode.NoContent));
        }


        /// <summary>
        /// 
        /// </summary>
        /// <param name="content"></param>
        /// <returns></returns>
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
                    //var picture = await _fileManager.UploadPictureToS3(User.Identity.GetUserId(), file, status.FileName);
                    //File.Delete(filePath);
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
        /// <returns></returns>
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
        /// <returns></returns>
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
        /// <returns></returns>
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

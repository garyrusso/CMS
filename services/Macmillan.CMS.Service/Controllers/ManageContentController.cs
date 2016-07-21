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
using System.Threading.Tasks;
using Macmillan.CMS.Common;
using System.Configuration;
using System.Net.Http.Headers;

namespace Macmillan.CMS.Service.Controllers
{
    public class ManageContentController : ApiController 
    {
        IManageContentBusiness business;
        IDictionaryBusiness dictionaryBusiness;
        
        private readonly IFlowJsRepoBusiness _flowJs;      
        private string fileRepository = ConfigurationManager.AppSettings["FileRepository"];
        private string chunkRepository = ConfigurationManager.AppSettings["ChunkFileRepository"];
        
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
        /// CreateContent with given details
        /// </summary>
        /// <param name="content"></param>
        /// <returns></returns>       
        [HttpPost]
        public object CreateContent(HttpRequestMessage request,
            [FromBody] Content content)
        {
            Logger.Debug("Entering UploadMetadata");            

            string folderPath = this.fileRepository ;                     
            
            FileInfo[] filesInfo = new DirectoryInfo(folderPath).GetFiles().OrderByDescending(p => p.CreationTime).ToArray();
            

            object results = null;            
            foreach (FileInfo file in filesInfo)
            {                                   
               results = this.business.UploadMetadata(content, file);                   
               file.Delete();              
            }
            

            //Force clean up
            Directory.Delete(folderPath, true);
            Logger.Debug("Exiting UploadMetadata");
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
            var results = this.business.UpdateContent(content);
            Logger.Debug("Exiting UpdateContent");
            return results;
        }

        [HttpGet]
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

            var chunkExists = _flowJs.ChunkExists(this.chunkRepository, request);
            if (chunkExists)
                return Ok();            

            return StatusCode(HttpStatusCode.NoContent);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="content"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IHttpActionResult> UploadFile()
        {
            try
            {
              
                    var request = HttpContext.Current.Request;

                    if (request.Files.Count == 0)
                        return Ok();

                    var validationRules = new Macmillan.CMS.Common.Models.FlowModels.FlowValidationRules();                   
                    var status = _flowJs.PostChunk(request,this.fileRepository,this.chunkRepository,validationRules);

                    string errors = string.Empty;
                    status.ErrorMessages.ForEach(x => errors += " " + x);

                    if (!string.IsNullOrEmpty(errors))
                    {
                        Logger.Error(errors);

                        return StatusCode(HttpStatusCode.NotFound);
                    }
                    else if (status.Status == Macmillan.CMS.Common.Models.FlowModels.PostChunkStatus.Done)
                    {                       
                        this.UploadFile(new FileInfo(Path.Combine(this.fileRepository, status.FileName)));
                    }
                }
            
            catch (Exception ex)
            {
                Logger.Error(ex);
                return StatusCode(HttpStatusCode.NotFound);
            }

            return Ok();
        }

        private void UploadFile(FileInfo file)
        {
            this.business.UploadFile(file); 
        }

        private List<string> GetUploadFileTypes()
        {
            if (CustomCache.Get("supported-upload-types") == null)
            {
                CustomCache.Add("supported-upload-types", this.dictionaryBusiness.GetDictionary("supported-upload-types", "json"));
            }
             
            return (List<string>) CustomCache.Get("supported-upload-types");       
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

        private string ExtractHeader(string header)
        {
            IEnumerable<string> headerValues = HttpContext.Current.Request.Headers.GetValues(header);

            if (headerValues != null)
                return headerValues.FirstOrDefault();
            else
                return string.Empty;
        }

       
        [Route("download")]
        [HttpGet]
        public HttpResponseMessage DownloadContent(string uri)
        {
            HttpResponseMessage result = null;
            Logger.Debug("Entering SearchContents");
            result = this.business.DownloadContent(uri);
            Logger.Debug("Exiting SearchContents");
            return result;       
        }   
    }
}
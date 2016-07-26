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
            Logger.Info("Entering UploadMetadata Controller");
            string[] SessionID =  HttpContext.Current.Request.Headers.GetValues("X-userSession");
            string Path = "\\" + SessionID[0];
            string folderPath = this.fileRepository + Path;
            string chunkFolderPath = this.chunkRepository + Path;                          
            FileInfo[] filesInfo = new DirectoryInfo(folderPath).GetFiles().OrderByDescending(p => p.CreationTime).ToArray();

            Logger.Debug("Logging for UploadMetadata FileInfo from folderpath");

            object results = null;            
            foreach (FileInfo file in filesInfo)
            {                                   
               results = this.business.UploadMetadata(content, file);                   
               file.Delete();              
            }
            
            //Force clean up
             Directory.Delete(chunkFolderPath, true);
             Directory.Delete(folderPath, true);
            Logger.Info("Exiting UploadMetadata Controller");
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
            Logger.Info("Entering UpdateContent Controller");
            Logger.Debug("Logging Results for UpdateContent");
            var results = this.business.UpdateContent(content);
            Logger.Info("Exiting UpdateContent Controller");
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
            string[] SessionID = HttpContext.Current.Request.Headers.GetValues("X-userSession");
            string chunkRepo= this.chunkRepository + "\\" + SessionID[0];
            var chunkExists = _flowJs.ChunkExists(chunkRepo, request);
            if (chunkExists)
                return Ok();
            Logger.Info("StatusCode for UploadFile");
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
                    string[] SessionID = HttpContext.Current.Request.Headers.GetValues("X-userSession");
                    string chunkRepo = this.chunkRepository + "\\" + SessionID[0];
                    string fileRepo = this.fileRepository + "\\" + SessionID[0];
                    if (request.Files.Count == 0)
                        return Ok();

                    var validationRules = new Macmillan.CMS.Common.Models.FlowModels.FlowValidationRules();
                    var status = _flowJs.PostChunk(request,fileRepo,chunkRepo, validationRules);

                    string errors = string.Empty;
                    status.ErrorMessages.ForEach(x => errors += " " + x);
                
                    if (!string.IsNullOrEmpty(errors))
                    {
                        Logger.Error(errors);

                        return StatusCode(HttpStatusCode.NotFound);
                    }
                    else if (status.Status == Macmillan.CMS.Common.Models.FlowModels.PostChunkStatus.Done)
                    {
                        this.UploadFile(new FileInfo(Path.Combine(fileRepo, status.FileName)));
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
            Logger.Info("Entering DeleteContent Controller");
            Logger.Debug("Logging Results for DeleteContent");
            var results = this.business.DeleteContent(content);
            Logger.Info("Exiting DeleteContent Controller");
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
            Logger.Info("Entering GetContent Controller");
            Logger.Debug("Logging Results for GetContentDetails");
            var results = this.business.GetContent(uri);
            Logger.Info("Exiting GetContent Controller");
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
            Logger.Info("Entering GetContentMasterData Controller");
            Logger.Debug("Logging Results for GetContentMasterData");
            var results = this.business.GetContentMasterData(ContentDetails);
            Logger.Info("Exiting GetContentMasterData Controller");
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
            Logger.Info("Entering SearchContents Controller");
            Logger.Debug("Logging Results for SearchContents");
            var results = this.business.SearchContents(searchText, pageNumber, pageSize, orderBy);
            Logger.Info("Exiting SearchContents Controller");
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
            Logger.Info("Entering DownloadContent");
            Logger.Debug("Logging Results for DownloadContent");
            result = this.business.DownloadContent(uri);
            Logger.Info("Exiting DownloadContent");
            return result;       
        }   
    }
}
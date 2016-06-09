using Macmillan.CMS.Business;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace Macmillan.CMS.Service.Controllers
{
    [Authorize] 
    [RoutePrefix("api/File")] 
    public class FileController : ApiController
    {
       // private readonly IFileManagerService _fileManager; 
        private readonly IFlowJsRepoBusiness _flowJs; 

        public FileController() 
        { 
            //_fileManager = new FileManagerService(); 
            _flowJs = new FlowJsBusiness(); 
        } 
        const string Folder = @"C:\Temp\PicUpload";
        [HttpGet] 
        [Route("Upload")]
        public async Task<IHttpActionResult> FileUploadGet(HttpPostedFileBase ChunkExists) 
        { 
            var request = HttpContext.Current.Request;
            var chunkExists = _flowJs.ChunkExists(Folder, request); 
            if (chunkExists) return Ok(); 
            return NotFound(); 
        } 

        [HttpPost] 
        [Route("Upload")]
        public async Task<IHttpActionResult> FileUploadPost(HttpPostedFileBase PostChunk) 
        { 
            var request = HttpContext.Current.Request; 
            var validationRules = new Macmillan.CMS.Common.Models.FlowModels.FlowValidationRules(); 
            validationRules.AcceptedExtensions.AddRange(new List<string> { "jpeg", "jpg", "png", "bmp" }); 
            validationRules.MaxFileSize = 5000000; 
            try 
            { 
                var status = _flowJs.PostChunk(request, Folder, validationRules); 
                if (status.Status == Macmillan.CMS.Common.Models.FlowModels.PostChunkStatus.Done) 
                { 
                     //file uploade is complete. Below is an example of further file handling 
                     var filePath = Path.Combine(Folder, status.FileName); 
                     var file = File.ReadAllBytes(filePath); 
                     //var picture = await _fileManager.UploadPictureToS3(User.Identity.GetUserId(), file, status.FileName); 
                    File.Delete(filePath); 
                    return Ok(file); 
                } 
                if (status.Status == Macmillan.CMS.Common.Models.FlowModels.PostChunkStatus.PartlyDone) 
                { 
                    return Ok(); 
                } 
                status.ErrorMessages.ForEach(x => ModelState.AddModelError("file", x)); 
                return BadRequest(ModelState); 
            } 
            catch (Exception) 
            { 
                ModelState.AddModelError("file", "exception"); 
                return BadRequest(ModelState);
            } 
        } 
    }
}
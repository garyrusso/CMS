﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace Macmillan.CMS.Business
{
    public class FlowJsBusiness : IFlowJsRepoBusiness
    {
        public Macmillan.CMS.Common.Models.FlowModels.FlowJsPostChunkResponse PostChunk(HttpRequest request, string folder)
            return PostChunkBase(request, folder, null);
        }

        public Macmillan.CMS.Common.Models.FlowModels.FlowJsPostChunkResponse PostChunk(HttpRequest request, string folder, Macmillan.CMS.Common.Models.FlowModels.FlowValidationRules validationRules)
        {
            return PostChunkBase(request, folder, validationRules);
        }

        public bool ChunkExists(string folder, HttpRequest request)
        {
            var identifier = request.QueryString["flowIdentifier"];
            var chunkNumber = int.Parse(request.QueryString["flowChunkNumber"]);
            var chunkFullPathName = GetChunkFilename(chunkNumber, identifier, folder);
            return File.Exists(Path.Combine(folder, chunkFullPathName));
        }

        private Macmillan.CMS.Common.Models.FlowModels.FlowJsPostChunkResponse PostChunkBase(HttpRequest request, string folder, Macmillan.CMS.Common.Models.FlowModels.FlowValidationRules validationRules)
        {
            var chunk = new Macmillan.CMS.Common.Models.FlowModels.FlowChunk();
            var requestIsSane = chunk.ParseForm(request.Form);
            if (!requestIsSane)
            {
                var errResponse = new Macmillan.CMS.Common.Models.FlowModels.FlowJsPostChunkResponse();
                errResponse.Status = Macmillan.CMS.Common.Models.FlowModels.PostChunkStatus.Error;
                errResponse.ErrorMessages.Add("damaged");
            }
            List<string> errorMessages = null;
            var file = request.Files[0];
            var response = new Macmillan.CMS.Common.Models.FlowModels.FlowJsPostChunkResponse { FileName = chunk.FileName, Size = chunk.TotalSize };
            var chunkIsValid = true;
            if (validationRules != null)
                chunkIsValid = chunk.ValidateBusinessRules(validationRules, out errorMessages);
            if (!chunkIsValid)
            {
                response.Status = Macmillan.CMS.Common.Models.FlowModels.PostChunkStatus.Error;
                response.ErrorMessages = errorMessages;
                return response;
            }

            var chunkFullPathName = GetChunkFilename(chunk.Number, chunk.Identifier, folder);
            try
            {
                // create folder if it does not exist 
                if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);
                // save file 
                file.SaveAs(chunkFullPathName);
            }
            catch (Exception)
            {
                throw;
            }

            // see if we have more chunks to upload. If so, return here 
            for (int i = 1, l = chunk.TotalChunks; i <= l; i++)
            {
                var chunkNameToTest = GetChunkFilename(i, chunk.Identifier, folder);
                var exists = File.Exists(chunkNameToTest);
                if (!exists)
                {
                    response.Status = Macmillan.CMS.Common.Models.FlowModels.PostChunkStatus.PartlyDone;
                    return response;
                }
            }

            // if we are here, all chunks are uploaded 
            var fileAry = new List<string>();
            for (int i = 1, l = chunk.TotalChunks; i <= l; i++)
            {
                fileAry.Add("flow-" + chunk.Identifier + "." + i);
            }
            MultipleFilesToSingleFile(folder, fileAry, chunk.FileName);
            for (int i = 0, l = fileAry.Count; i < l; i++)
            {
                try
                {
                    File.Delete(Path.Combine(folder, fileAry[i]));
                }
                catch (Exception)
                {
                }
            }
            response.Status = Macmillan.CMS.Common.Models.FlowModels.PostChunkStatus.Done;
            return response;
        }

        private static void MultipleFilesToSingleFile(string dirPath, IEnumerable<string> fileAry, string destFile)
        {
            using (var destStream = File.Create(Path.Combine(dirPath, destFile)))
            {
                foreach (string filePath in fileAry)
                {
                    using (var sourceStream = File.OpenRead(Path.Combine(dirPath, filePath)))
                        sourceStream.CopyTo(destStream); // You can pass the buffer size as second argument. 
                }
            }
        }

        private string GetChunkFilename(int chunkNumber, string identifier, string folder)
        {
            return Path.Combine(folder, "flow-" + identifier + "." + chunkNumber);
        } 
    }
}

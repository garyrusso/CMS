using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web; 

namespace Macmillan.CMS.DAL
{
    public class FlowJsRepoDAL : IFlowJsRepoDAL
    {
        /// <summary>
        /// PostChunk with given details 
        /// </summary>
        /// <param name="request"></param>
        /// <param name="folder"></param>
        /// <returns>Returns object for postchunk</returns>
        public Macmillan.CMS.Common.Models.FlowModels.FlowJsPostChunkResponse PostChunk(HttpRequest request, string folder)
        {
            return null;
        }

        /// <summary>
        /// Postchunk with validation details
        /// </summary>
        /// <param name="request"></param>
        /// <param name="folder"></param>
        /// <param name="validationRules"></param>
        /// <returns>Returns object for postchunk with validationrule</returns>
        public Macmillan.CMS.Common.Models.FlowModels.FlowJsPostChunkResponse PostChunk(HttpRequest request, string folder, Macmillan.CMS.Common.Models.FlowModels.FlowValidationRules validationRules)
        {
            return null;
        }

        /// <summary>
        /// Chunk Exists for folder with given details 
        /// </summary>
        /// <param name="folder"></param>
        /// <param name="request"></param>
        /// <returns>Returns object for Chunkexists</returns>
        public bool ChunkExists(string folder, HttpRequest request)
        {
            return true;
        }
    } 
    
}




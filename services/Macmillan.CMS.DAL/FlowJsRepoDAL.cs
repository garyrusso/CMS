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
        public Macmillan.CMS.Common.Models.FlowModels.FlowJsPostChunkResponse PostChunk(HttpRequest request, string folder)
        {
            return null;
        }

        public Macmillan.CMS.Common.Models.FlowModels.FlowJsPostChunkResponse PostChunk(HttpRequest request, string folder, Macmillan.CMS.Common.Models.FlowModels.FlowValidationRules validationRules)
        {
            return null;
        }

        public bool ChunkExists(string folder, HttpRequest request)
        {
            return true;
        }
    } 
    
}




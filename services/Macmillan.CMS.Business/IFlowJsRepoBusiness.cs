﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace Macmillan.CMS.Business
{
    public interface IFlowJsRepoBusiness
    {
        Macmillan.CMS.Common.Models.FlowModels.FlowJsPostChunkResponse PostChunk(HttpRequest request, string folder);

        Macmillan.CMS.Common.Models.FlowModels.FlowJsPostChunkResponse PostChunk(HttpRequest request, string folder, string chunkfolder, Macmillan.CMS.Common.Models.FlowModels.FlowValidationRules validationRules);

        bool ChunkExists(string folder, HttpRequest request); 
    }
}
            
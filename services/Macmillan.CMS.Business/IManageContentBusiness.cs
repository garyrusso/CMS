﻿using Macmillan.CMS.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Macmillan.CMS.Business
{
    /// <summary>
    /// Hosts all ManageContents and other ManageContents (if any) related functionalities.
    /// </summary>
     public interface IManageContentBusiness
    {
         object CreateContent(Content Content);
         object UpdateContent(Content Content);
         object DeleteContent(Content Content);
        object GetContent(string docUri);
        object GetContentMasterData(List<Content> ContentDetails);
        object SearchContents(string searchText, int pageNumber, int pageSize, string orderBy);
    }
}

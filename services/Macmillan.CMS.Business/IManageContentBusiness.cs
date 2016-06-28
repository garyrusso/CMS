using Macmillan.CMS.Common.Models;
using System;
using System.Collections.Generic;
using System.IO;
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
        object UploadMetadata(Content content, FileInfo file);
        object UpdateContent(Content content);
        object DeleteContent(Content content);
        object GetContent(string docUri);
        void UploadFile(FileInfo file);
        object GetContentMasterData(List<Content> ContentDetails);
        object SearchContents(string searchText, int pageNumber, int pageSize, string orderBy);
    }
}

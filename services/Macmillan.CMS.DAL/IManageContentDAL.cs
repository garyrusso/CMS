using Macmillan.CMS.Common.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Macmillan.CMS.DAL
{
    /// <summary>
    /// Interface for ManageContentDAL Layer
    /// </summary>
     public interface IManageContentDAL
    {
         object UploadMetadata(string metaData);
         object UpdateContent(string projJson, string projUri);
         object DeleteContent(string projUri);
         void UploadFile(FileInfo file);
         object GetContent(string docUri);
         object GetContentMasterData(List<Content> ContentDetails);
         object SearchContents(string searchText, int pageNumber, int pageSize, string orderBy);
    }
}

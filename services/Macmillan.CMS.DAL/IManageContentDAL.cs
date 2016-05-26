using Macmillan.CMS.Common.Models;
using System;
using System.Collections.Generic;
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
         object CreateContent(string projXml, string projUri);
         object UpdateContent(string projXml, string projUri);
         object DeleteContent(string projXml, string projUri);
         object GetContent(string docUri);
         object GetContentMasterData(List<Content> ContentDetails);
         object SearchContents(string searchText, int pageNumber, int pageSize, string orderBy);
    }
}

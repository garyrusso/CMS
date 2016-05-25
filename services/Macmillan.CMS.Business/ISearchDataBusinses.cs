using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Macmillan.CMS.Business
{
    /// <summary>
    /// Interface for SearchDataBusinses layer
    /// </summary>
    public interface ISearchDataBusinses
    {
        object GetData(string orderBy, int pageNumber, int pageSize, string searchText, string searchType, string userName);
    }
}

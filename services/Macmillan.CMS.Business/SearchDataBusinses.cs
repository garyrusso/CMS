using Macmillan.CMS.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Macmillan.CMS.Business
{
    public class SearchDataBusinses : ISearchDataBusinses
    {
        ISearchDataDAL searchDataDAL;

        public SearchDataBusinses(ISearchDataDAL dal)
        {
            this.searchDataDAL = dal;
        }
        public object GetData(string orderBy, int pageNumber, int pageSize, string searchText, string searchType, string userName)
        {
            return this.searchDataDAL.GetData(orderBy, pageNumber, pageSize, searchText, searchType, userName);
        }
    }
}

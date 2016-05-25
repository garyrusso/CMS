using Macmillan.CMS.Business;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Macmillan.CMS.Service.Controllers
{
    public class SearchDataController : ApiController
    {
        ISearchDataBusinses searchDataBusiness;

        public SearchDataController(ISearchDataBusinses business)
        {
            this.searchDataBusiness = business;    
        }

        [HttpGet]
        [AcceptVerbs("Get")]
        public object Get(string orderBy, int pageNumber, int pageSize, string searchText, string searchType, string userName)
        {
            return this.searchDataBusiness.GetData(orderBy, pageNumber, pageSize, searchText, searchType, userName);
        }

    }
}
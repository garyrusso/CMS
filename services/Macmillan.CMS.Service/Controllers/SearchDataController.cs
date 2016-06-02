using Macmillan.CMS.Business;
using Macmillan.CMS.Common.Logging;
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
        /// <summary>
        /// Initializes a new instance of the <see cref="<SearchDataController>"/> class.
        /// </summary>
        /// <param name="business"></param>
        public SearchDataController(ISearchDataBusinses business)
        {
            this.searchDataBusiness = business;    
        }

        /// <summary>
        /// Get with given details
        /// </summary>
        /// <param name="orderBy"></param>
        /// <param name="pageNumber"></param>
        /// <param name="pageSize"></param>
        /// <param name="searchText"></param>
        /// <param name="searchType"></param>
        /// <param name="userName"></param>
        /// <returns>Returns object for Get</returns>
        [HttpGet]
        [AcceptVerbs("Get")]
        public object Get(string orderBy, int pageNumber, int pageSize, string searchText, string searchType, string userName)
        {
            Logger.Debug("Entering Get");
            var results= this.searchDataBusiness.GetData(orderBy, pageNumber, pageSize, searchText, searchType, userName);
            Logger.Debug("Exiting Get");
            return results;
        }

    }
}
﻿using Macmillan.CMS.Common.Logging;
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
        /// <summary>
        /// Initializes a new instance of the <see cref="<SearchDataBusinses>"/> class.
        /// </summary>
        public SearchDataBusinses(ISearchDataDAL dal)
        {
            this.searchDataDAL = dal;
        }

        /// <summary>
        /// getdata with given details
        /// </summary>
        /// <param name="orderBy"></param>
        /// <param name="pageNumber"></param>
        /// <param name="pageSize"></param>
        /// <param name="searchText"></param>
        /// <param name="searchType"></param>
        /// <param name="userName"></param>
        /// <returns></returns>
        public object GetData(string orderBy, int pageNumber, int pageSize, string searchText, string searchType, string userName, string[] facets)
        {
            Logger.Info("Entering GetData");
            var results = this.searchDataDAL.GetData(orderBy, pageNumber, pageSize, searchText, searchType, userName,facets);
            Logger.Debug("Logging for Results GetData with pageNumber,facets");
            Logger.Info("Exiting GetData");
            return results;
        }
    }
}

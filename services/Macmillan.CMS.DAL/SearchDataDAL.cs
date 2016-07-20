using Macmillan.CMS.Common;
using Macmillan.CMS.Common.Logging;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Macmillan.CMS.DAL
{
    public class SearchDataDAL : ISearchDataDAL
    {
        /// <summary>
        /// GetData for search data with given details
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
      

            //Call ML and SearchProjects
            Logger.Debug("Entering SearchData");
       
            MLReader mlReader = new MLReader();
            //get Marklogic url for CRUD operations
            pageNumber = ((pageNumber - 1) * pageSize) + 1;
            string facetsParam = string.Empty;

            if (searchText != string.Empty && searchText != null)
            {
                searchText= ""+ searchText +"";
            }

            if (facets != null)
            {
                if (searchText != string.Empty && searchText != null)
                {
                    searchText = searchText + "AND ";
                }
                //facetsParam = string.Join("&rs:q=", facets);
                searchText = searchText + string.Join(" AND ", facets);
            }
            

            if (searchType == "all")
            {
                searchType = "project";
            }
            string mlUrl = ConfigurationManager.AppSettings["MarkLogic_CRUD_URL"] + searchType + "?name=" + searchType + "&rs:q=" + searchText + "&rs:format=json&rs:pageLength=" + pageSize + "&rs:start=" + pageNumber;// +"&rs:q=" + facetsParam;
            string results = mlReader.GetHttpContent(mlUrl, "application/json");

            Logger.Debug("Exiting SearchData");
            return mlReader.ConverttoJson<object>(results);


         
          
        }
    }
}

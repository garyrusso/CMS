using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Macmillan.CMS.Business;
using Macmillan.CMS.Common.Logging;
using Macmillan.CMS.Common;
using System.Web;
namespace Macmillan.CMS.Service.Controllers
{
    public class DictionaryController : ApiController
    {
        IDictionaryBusiness dictionaryBusiness;
        public DictionaryController(IDictionaryBusiness business)
        {
            this.dictionaryBusiness = business;
        }

        /// <summary>
        /// GetDictionary with given details
        /// </summary>
        /// <param name="dictionaryType"></param>
        /// <param name="outputFormat"></param>
        /// <returns></returns>
        [HttpGet]
        public object GetDictionary(string dictionaryType, string outputFormat)
        {
            Logger.Debug("Entering GetDictionary");

            object results = null;

            if (CustomCache.Get(dictionaryType) == null)
            {
                results = this.dictionaryBusiness.GetDictionary(dictionaryType, outputFormat);
                CustomCache.Add(dictionaryType, results);
            }
            else
            {
                results = CustomCache.Get(dictionaryType);
            }
            
            Logger.Debug("Exiting GetDictionary");
            return results;
        }

        
    }
}
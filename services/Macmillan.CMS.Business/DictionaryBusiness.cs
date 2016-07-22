using Macmillan.CMS.Common.Logging;
using Macmillan.CMS.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Macmillan.CMS.Business
{
    public class DictionaryBusiness:IDictionaryBusiness
    {    
        IDictionaryDAL dal;
        /// <summary>
        /// Initializes a new instance of the <see cref="<DictionaryBusiness>"/> class.
        /// </summary>
        /// <param name="dal"></param>
        public DictionaryBusiness(IDictionaryDAL dal)
        {
            this.dal = dal;
        }

        /// <summary>
        /// GetDictionary with given details
        /// </summary>
        /// <param name="dictionaryType"></param>
        /// <param name="outputFormat"></param>
        /// <returns>Returns object for GetDictionary</returns>
        public object GetDictionary(string dictionaryType, string outputFormat)
        {
            Logger.Info("Entering GetDictionary");
            Logger.Debug("Logging Results for GetDictionary");
            var results = this.dal.GetDictionary(dictionaryType, outputFormat);
            Logger.Info("Exiting GetDictionary");
            return results;
        }
    }
}

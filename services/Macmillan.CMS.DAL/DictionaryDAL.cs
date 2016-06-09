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
    public class DictionaryDAL:IDictionaryDAL
    {
        /// <summary>
        /// GetDictionary with given details 
        /// </summary>
        /// <param name="dictionaryType"></param>
        /// <param name="outputFormat"></param>
        /// <returns>Returns object for GetDictionary</returns>
        public object GetDictionary(string dictionaryType, string outputFormat)
        {
            Logger.Debug("Entering GetDictionary");

             JsonNetSerialization ser = new JsonNetSerialization();
             string con = @"{'results':{'val':[{'name':'bedford_st_martins','value':'Bedford/St. Martins'},{'name':'wh_freeman','value':'W.H. Freeman'},{'name':'worth_publishers','value':'Worth Publishers'},{'name':'sapling_learning','value':'Sapling Learning'},{'name':'late_nite_labs','value':'Late Nite Labs'},{'name':'hayden-mcneil','value':'Hayden-McNeil'},{'name':'prepu','value':'PrepU'},{'name':'dynamic_books','value':'Dynamic Books'},{'name':'bfw_high_school','value':'BFW High School'}]}}
                            ";
             var results = ser.DeSerialize(con);
            //string mlUrl = ConfigurationManager.AppSettings["MarkLogic_DICTIONARY_URL"] + "?rs:dictionaryType=" + dictionaryType + "&rs:output-format=" + outputFormat;

            //MLReader mlReader = new MLReader();
            //var results = mlReader.GetHttpContent<object>(mlUrl);
            Logger.Debug("Exiting GetDictionary");
            return results;
        }
    }
}

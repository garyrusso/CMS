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

        public DictionaryBusiness(IDictionaryDAL dal)
        {
            this.dal = dal;
        }

        public object GetDictionary(string dictionaryType, string outputFormat)
        {
            return this.dal.GetDictionary(dictionaryType, outputFormat);
        }
    }
}

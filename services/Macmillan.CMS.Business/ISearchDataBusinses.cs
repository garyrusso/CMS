﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Macmillan.CMS.Business
{
    public interface ISearchDataBusinses
    {
        object GetData(string orderBy, int pageNumber, int pageSize, string searchText, string searchType, string userName);
    }
}

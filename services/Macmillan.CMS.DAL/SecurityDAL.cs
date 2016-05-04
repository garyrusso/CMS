using Macmillan.CMS.Common;
using Macmillan.CMS.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Macmillan.CMS.DAL
{
    public class SecurityDAL : ISecurityDAL
    {
        public SecurityDAL()
        { }

        public object GetUserData()
        {
           
            JsonNetSerialization ser = new JsonNetSerialization();
            string content = @"{ 'Name': 'Jon Smith', 'Address': { 'City': 'New York', 'State': 'NY' }, 'Age': 42 }";
            return ser.DeSerialize(content);
        }

        public Project GetProject(string uri)
        {
            MLReader mlReader = new MLReader();

            Project proj = mlReader.GetHttpContent<Project>("http://ML/Project?docUri=adf");

            return proj;
        }
    }
}

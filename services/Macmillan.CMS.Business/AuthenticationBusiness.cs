using Macmillan.CMS.Common.Models;
using Macmillan.CMS.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Macmillan.CMS.Business
{
     public class AuthenticationBusiness : IAuthenticationBusiness 
    {
         IAuthenticationDAL dal;

         public AuthenticationBusiness(IAuthenticationDAL AuthenticationDAL)
         {
             this.dal = AuthenticationDAL;
         }

         public object ValidateUserCredentials(Authentication Authentication)
         {
             //Build XML
             
             //Post it to MarkLogic
             return null;
         }
    }
}

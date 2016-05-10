﻿using Macmillan.CMS.Common;
using Macmillan.CMS.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

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

        public object ValidateUserCredentials(Authentication authentication)
        {
            var jsonString = @"{'UserName':'UserName','PassWord':'PassWord',}";

            dynamic json = JValue.Parse(jsonString);

            var jsonObject = json;//new JObject();

            dynamic Authentication = jsonObject;
            if (Authentication.UserName == "UserName" && Authentication.PassWord =="PassWord")
            {
                JsonNetSerialization ser = new JsonNetSerialization();
                string content = @"{'session_token':'ZTQyMjE4YTdhYTE3OTI4NTljdhYTU0ZTAyNjk2Mg',
                        'expires_in': 3600,
                        'token_type': 'bearer',
                        'scope': 'user'}";
                return ser.DeSerialize(content);
            }
            else
            {
                JsonNetSerialization ser = new JsonNetSerialization();
                string content = @"{
                            'code': 'invalid grant',
                            'user_message': 'Invalid Authentication',
                		    'Developers': 'Please review the system logs for more information',
                		    'info': [],
                            'data':[]}";
                return ser.DeSerialize(content);
            }       
        }

    }
}

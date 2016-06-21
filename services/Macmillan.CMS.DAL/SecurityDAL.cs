﻿
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using Macmillan.CMS.Common;
using Macmillan.CMS.Common.Models;
using Macmillan.CMS.Common.Logging;
using System.Configuration;

namespace Macmillan.CMS.DAL
{
    public class SecurityDAL : ISecurityDAL
    {
        public SecurityDAL()
        { }
        /// <summary>
        /// get user data with given details
        /// </summary>
        /// <returns></returns>
        public object GetUserData()
        {
            Logger.Debug("Entering GetUserData");
            JsonNetSerialization ser = new JsonNetSerialization();
            string content = @"{ 'Name': 'Jon Smith', 'Address': { 'City': 'New York', 'State': 'NY' }, 'Age': 42 }";         
            var results= ser.DeSerialize(content);
            Logger.Debug("Exiting GetUserData");
            return results;
        }
       
        public object ValidateUser(Authentication authentication)
        {
            //Post it to MarkLogic  
            //string mlUrl = "http://ec2-54-209-174-53.compute-1.amazonaws.com:8060/login";
            //string mlUrl = ConfigurationManager.AppSettings["MarkLogicResourceURL"] + "login?name=login";
            string mlUrl = ConfigurationManager.AppSettings["MarkLogicResourceURL"] + "login";
            //string mlUrl = "http://ec2-54-209-174-53.compute-1.amazonaws.com:8060/v1/resources/login?name=login";
            //string[] mlCredentials = ConfigurationManager.AppSettings["MarkLogicCredentials"].Split(new char[] { '/' });
            MLReader mlReader = new MLReader();

            //get base64 representaion of user name and password
            //string authorization = "Basic " + this.ConvertoBase64(mlCredentials[0] + ":" + mlCredentials[1]);
            string userInfo = this.ConvertoBase64(authentication.username.Split(new char[] { '@' })[0] + ":" + authentication.password);
            
            Dictionary<string, string> requestHeader = new Dictionary<string, string>();

            //requestHeader.Add("Authorization", authorization);
            requestHeader.Add("UserInfo", userInfo);

            object results = null;
            try
            {
                results = mlReader.GetHttpContent<object>(mlUrl, "application/json", requestHeader);
            }
            catch (Exception ex)
            {
                //{"responseCode":"401","message":"User/Pass incorrect"}

                if (ex.Message.Contains("401"))
                { 
                    var error = new {responseCode ="401", message = "User/Pass incorrect"};

                    results = error;
                }
            }

            return results;
        }

        public string ConvertoBase64(string text)
        {
            var textBytes = System.Text.Encoding.UTF8.GetBytes(text);
            return System.Convert.ToBase64String(textBytes);
        }

        public string Base64Decode(string base64EncodedData)
        {
            var base64EncodedBytes = System.Convert.FromBase64String(base64EncodedData);
            return System.Text.Encoding.UTF8.GetString(base64EncodedBytes);
        }

        /// <summary>
        /// ValidateUserCredentials with given details
        /// </summary>
        /// <param name="authentication"></param>
        /// <returns></returns>
        public object ValidateUserCredentials(Authentication authentication)
        {
            //Call ML and ValidateUserCredentials
            Logger.Debug("Entering ValidateUserCredentials");
            if (authentication.username == "admin@techm.com" && authentication.password == "password")
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
                string content = @"{'errors': [{
		                    'code': 'invalid_grant',
		                    'user_message': 'Invalid Authentication',
		                    'developer_message': 'Developers: Please review the system logs for more information',
		                    'info': []
	                    }],
	                    'data': []
                        }";
               
                var results= ser.DeSerialize(content);
                 Logger.Debug("Exiting ValidateUserCredentials");
                 return results;
            }
        }

    }
}

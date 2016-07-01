namespace Macmillan.CMS.Common
{
    using System;
    using System.Configuration;
    using System.Linq;
    using System.Net.Cache;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.Runtime.Serialization;
    using Newtonsoft.Json.Linq;
    using System.Net;
    using System.Collections.Generic;
    using System.Web;
    using System.IO;

    public enum SupportedHttpMethods
    {
        GET,
        POST,
        PUT,
        DELETE
    }

    public class HttpClass : IDisposable
    {
        private Uri uri;

        private HttpMethod httpMethod;

        private HttpContent content;

        private HttpClient httpClient; // = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true });

        private Action action;

        private HttpResponseMessage httpResponseMessage;

        private bool disposed = false;

        public string responseStatusCode = string.Empty;
        public bool errorOccurred = false;

        public string file;

        Dictionary<string, string> rqstHeaders = null;
        Dictionary<string, string> cntHeaders = null;


        private HttpWebResponse httpWebMethod;


        public HttpClass(string uri, 
            SupportedHttpMethods httpMethod, 
            string mediaType = "text/json", 
            string content = null,
            Dictionary<string, string> requestHeaders = null,
            Dictionary<string, string> contentHeaders = null)
        {
            if (content != null)
            {
                this.content = new StringContent(content);
                this.content.Headers.ContentType = new MediaTypeHeaderValue(mediaType);
            }



            this.rqstHeaders = requestHeaders;
            this.cntHeaders = contentHeaders;

            if (this.rqstHeaders == null)
                this.rqstHeaders = new Dictionary<string, string>();

            if (this.cntHeaders == null)
                this.cntHeaders = new Dictionary<string, string>();

            this.rqstHeaders.Add("Authorization", this.BuildAuthHeader());
            this.rqstHeaders.Add("X-Auth-Token", this.BuildUserTokenHeader());
            
            this.httpClient = new HttpClient();
            this.uri = new Uri(uri, UriKind.Absolute);
            this.httpMethod = new HttpMethod(httpMethod.ToString());

            if (ConfigurationManager.AppSettings["TimeOut"] != null)
            {
                this.httpClient.Timeout = new TimeSpan(0, Convert.ToInt16(ConfigurationManager.AppSettings["TimeOut"]), 0);
            }

            switch (httpMethod)
            {
                case SupportedHttpMethods.GET:
                    this.action = this.Get;
                    break;
                case SupportedHttpMethods.POST:
                    this.action = this.Post;
                    break;
                case SupportedHttpMethods.PUT:
                    this.action = this.Put;
                    break;
                case SupportedHttpMethods.DELETE:
                    this.action = this.Delete;
                    break;
                default:
                    throw new InvalidHttpMethodException();
            }
        }

        ~HttpClass()
        {
            this.Dispose(false);
        }

        public void Dispose()
        {
            this.Dispose(true);
            GC.SuppressFinalize(this);
        }

        public HttpResponseMessage GetHttpResponseMessage()
        {
            return this.httpResponseMessage;
        }

        public string GetResponseContent()
        {
            string result = this.httpResponseMessage.Content.ReadAsStringAsync().Result;

            return result;
        }

        public void Invoke()
        {
            this.action.Invoke();
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!this.disposed)
            {
                if (disposing)
                {
                    if (this.content != null)
                    {
                        this.content.Dispose();
                    }

                    if (this.httpClient != null)
                    {
                        this.httpClient.Dispose();
                    }
                }

                this.disposed = true;
            }
        }

        private void Delete()
        {
            if (this.rqstHeaders != null)
            {
                foreach (var item in this.rqstHeaders)
                {
                    this.httpClient.DefaultRequestHeaders.TryAddWithoutValidation(item.Key, item.Value);
                }
            }
          
            this.httpResponseMessage = this.httpClient.DeleteAsync(this.uri).Result;
            this.IdentifyErrors(this.httpResponseMessage);
        }

        private void Get()
        {
            if (this.rqstHeaders != null)
            {
                foreach (var item in this.rqstHeaders)
                {
                    this.httpClient.DefaultRequestHeaders.TryAddWithoutValidation(item.Key, item.Value);
                }
            }

            this.httpResponseMessage = this.httpClient.GetAsync(this.uri).Result;
            this.IdentifyErrors(this.httpResponseMessage);
        }

        private void Post()
        {
          

            if (this.rqstHeaders != null)
            {
                foreach (var item in this.rqstHeaders)
                {
                    this.httpClient.DefaultRequestHeaders.TryAddWithoutValidation(item.Key, item.Value);
                }
            }

            if (this.cntHeaders != null)
            {
                foreach (var item in this.cntHeaders)
                {
                    this.content.Headers.Add(item.Key, item.Value);
                }
            }

             

            if (!string.IsNullOrEmpty(this.file))
            {
                var method = new MultipartFormDataContent();
                var streamContent = new StreamContent(File.Open(this.file, FileMode.Open));
                method.Add(streamContent, "filename");
                method.Headers.ContentType = MediaTypeHeaderValue.Parse("image/jpeg");

                this.content = method;
            }

            var result = this.httpClient.PostAsync(this.uri, this.content);
            this.httpResponseMessage = result.Result;

            this.IdentifyErrors(this.httpResponseMessage);

              
        }

        private void Put()
        {
            if (this.rqstHeaders != null)
            {
                foreach (var item in this.rqstHeaders)
                {
                    this.httpClient.DefaultRequestHeaders.TryAddWithoutValidation(item.Key, item.Value);
                }
            }

            if (this.cntHeaders != null)
            {
                foreach (var item in this.cntHeaders)
                {
                    this.content.Headers.Add(item.Key, item.Value);
                }
            }
            this.httpResponseMessage = this.httpClient.PutAsync(this.uri, this.content).Result;
            this.IdentifyErrors(this.httpResponseMessage);
        }

        private void IdentifyErrors(HttpResponseMessage msg)
        {
            string content = msg.ToString();

            //responseStatusCode = msg.StatusCode.ToString();

            if (!content.Contains("StatusCode: 20"))
                this.errorOccurred = true;
        }

        private string ExtractHeader(string header)
        {
            IEnumerable<string> headerValues = HttpContext.Current.Request.Headers.GetValues(header);

            if (headerValues != null)
                return headerValues.FirstOrDefault();
            else
                return string.Empty;
        }

        private string BuildAuthHeader()
        {
            string[] mlCredentials = ConfigurationManager.AppSettings["MarkLogicCredentials"].Split(new char[] { '/' });

            string authToken = "Basic " + this.ConvertoBase64(mlCredentials[0] + ":" + mlCredentials[1]);

            return authToken;
        }

        private string BuildUserTokenHeader()
        {            
            //string userToken = this.ExtractHeader("X-Auth-Token");             
            //return userToken;

            return "Z3J1c3NvOnBhc3N3b3Jk";
        }

        private string ConvertoBase64(string text)
        {
            var textBytes = System.Text.Encoding.UTF8.GetBytes(text);
            return System.Convert.ToBase64String(textBytes);
        }

        public HttpResponseMessage GetWebFileResponse(string uri, string file)
        {
            HttpResponseMessage result = null;
            string url = uri;
            string fileName = file;       

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
            request.Timeout = 5000;

            request.Headers.Add("UserInfo", this.BuildUserTokenHeader());
            request.Headers.Add("Authorization", this.BuildAuthHeader());
    

            try
            {
                using (WebResponse response = (HttpWebResponse)request.GetResponse())
                {
                        byte[] bytes = ReadFully(response.GetResponseStream());                      
                        HttpResponseMessage fileContent = new HttpResponseMessage(HttpStatusCode.OK);                        
                        fileContent.Content = new ByteArrayContent(bytes);                      
                        fileContent.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment")
                        {
                            FileName = fileName
                        };
                        fileContent.Content.Headers.ContentDisposition.FileName = fileName;
                        fileContent.Content.Headers.ContentType =
                            new MediaTypeHeaderValue("application/octet-stream");
                        result = fileContent;

                   // }
                }
            }
            catch (WebException)
            {
                Console.WriteLine("Error Occured");
            }

            return result;
        }

        public static byte[] ReadFully(Stream input)
        {
            byte[] buffer = new byte[16 * 1024];
            using (MemoryStream ms = new MemoryStream())
            {
                int read;
                while ((read = input.Read(buffer, 0, buffer.Length)) > 0)
                {
                    ms.Write(buffer, 0, read);
                }
                return ms.ToArray();
            }
        }
    }

    [Serializable]
    public class InvalidHttpMethodContentCombinationException : Exception
    {
        public InvalidHttpMethodContentCombinationException()
            : base("When specifying content, either a POST or PUT must be used")
        {
        }

        public InvalidHttpMethodContentCombinationException(string msg)
            : base(msg)
        {
        }

        public InvalidHttpMethodContentCombinationException(string msg, Exception ex)
            : base(msg, ex)
        {
        }

        protected InvalidHttpMethodContentCombinationException(
            SerializationInfo info,
            StreamingContext context)
            : base(info, context)
        {
        }

        public override void GetObjectData(
            SerializationInfo info,
            StreamingContext context)
        {
            base.GetObjectData(info, context);
        }
    }

    [Serializable]
    public class InvalidHttpMethodException : Exception
    {
        public InvalidHttpMethodException()
            : base("Only PUT, POST, GET and DELETE Methods are supported")
        {
        }

        public InvalidHttpMethodException(string msg)
            : base(msg)
        {
        }

        public InvalidHttpMethodException(string msg, Exception ex)
            : base(msg, ex)
        {
        }

        protected InvalidHttpMethodException(
        SerializationInfo info,
        StreamingContext context)
            : base(info, context)
        {
        }

        public override void GetObjectData(
        SerializationInfo info,
        StreamingContext context)
        {
            base.GetObjectData(info, context);
        }
    }
}
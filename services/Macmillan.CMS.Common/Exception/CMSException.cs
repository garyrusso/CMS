namespace Macmillan.CMS.Common
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Runtime.Serialization;
    using System.Security.Permissions;
    using System.Text;
    
    [Serializable]
    public enum CMSExceptionTypes
    {       
        ValidationException,

        DataException,

        BusinessException,

        ServiceException,

        GeneralException,

        SecurityException,

        FatalException
    }

    [Serializable]
    public class CMSException : System.Exception, ISerializable
    {
        public CMSExceptionTypes ExceptionType { get; set; }

        public string ErrorMessage { get; set; }

        public string ErrorCode { get; set; }
        
        public CMSException()
        {
        }
               
        public CMSException(string msg) : base(msg) 
        { 
        }

        public CMSException(string msg, Exception ex) : base(msg, ex)
        {
        }

        public CMSException(CMSExceptionTypes excType, string errorMsg, string errorCode)
            : base(errorMsg)
        {
            this.ExceptionType = excType;
            this.ErrorMessage = errorMsg;
            this.ErrorCode = errorCode;
        }
               
        protected CMSException(
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
namespace Macmillan.CMS.Common.Logging
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;
    
    /// <summary>
    /// Defines logger functionalities
    /// </summary>
    public interface ILogger
    {  
        /// <summary>
        /// Logs a debug message
        /// </summary>
        /// <param name="message">message to log</param>
        void Debug(object message);

        /// <summary>
        /// Logs a debug message
        /// </summary>
        /// <param name="message">message to log</param>
        /// <param name="exception">exception object</param>
        void Debug(object message, Exception exception);

        /// <summary>
        /// Logs information
        /// </summary>
        /// <param name="message">information message</param>
        void Info(object message);

        /// <summary>
        /// Logs information
        /// </summary>
        /// <param name="message">information message</param>
        /// <param name="exception">exception object</param>
        void Info(object message, Exception exception);

        /// <summary>
        /// Logs a warning message
        /// </summary>
        /// <param name="message">warning message</param>
        void Warn(object message);

        /// <summary>
        /// Logs a warning message
        /// </summary>
        /// <param name="message">warning message</param>
        /// <param name="exception">exception object</param>
        void Warn(object message, Exception exception);

        /// <summary>
        /// Logs an error message
        /// </summary>
        /// <param name="message">error message</param>
        void Error(object message);

        /// <summary>
        /// Logs an error message
        /// </summary>
        /// <param name="message">error message</param>
        /// <param name="exception">exception object</param>
        void Error(object message, Exception exception);

        /// <summary>
        /// Logs a fatal error message
        /// </summary>
        /// <param name="message">fatal error message</param>
        void Fatal(object message);

        /// <summary>
        /// Logs a fatal error message
        /// </summary>
        /// <param name="message">fatal error message</param>
        /// <param name="exception">exception object</param>
        void Fatal(object message, Exception exception);
    }
}

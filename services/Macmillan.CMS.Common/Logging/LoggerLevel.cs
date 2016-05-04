namespace Macmillan.CMS.Common.Logging
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;

    /// <summary>
    /// Logger level enumeration
    /// </summary>
    public enum LoggerLevel
    {
        /// <summary>
        /// Debug Logger level 
        /// </summary>
        Debug,

        /// <summary>
        /// Info Logger level 
        /// </summary>
        Info,

        /// <summary>
        /// Warning Logger level 
        /// </summary>
        Warning,

        /// <summary>
        /// Error Logger level 
        /// </summary>
        Error,

        /// <summary>
        /// Fatal Logger level 
        /// </summary>
        Fatal
    }
}
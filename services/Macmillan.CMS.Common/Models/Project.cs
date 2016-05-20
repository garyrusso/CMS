using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Macmillan.CMS.Common.Models
{
    public class Project
    {        
        public string Title { get; set; }
        public string Description { get; set; }
        public string ProjectState { get; set; }
        public string[] SubjectHeadings { get; set; }        
        public string[] SubjectKeywords { get; set; }
        public string SystemId { get; set; }
        public string ProjectURL { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
        public string CreatedBy { get; set; }
        public string ModifiedBy { get; set; }
        public string[] Content { get; set; }  
    }
}

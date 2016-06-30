using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Macmillan.CMS.Common.Models
{
    public class Content
    {
      public string ContentUri { get; set; }
      public string Title   {get;set;}
      public string Description{get;set;}
      public string Source { get; set; }
      public string[] Creator { get; set; }
      public string Publisher{get;set;}
      public string ContentState { get; set; }
      public string[] Projects { get; set; }
      public string[] SubjectHeadings { get; set; }
      public string[] SubjectKeywords { get; set; }
      public string SystemId { get; set; }
      public string DateCreated { get; set; }
      public string DateModified { get; set; }
      public string CreatedBy { get; set; }
      public string ModifiedBy { get; set; }
      public string DatePublished { get; set; }
      public string ContentResourceType { get; set; }
      public string FileFormat{get;set;}
      public string FileName  {get;set;}
      public string FileSize { get; set; }
      public string FilePath { get; set; }
    }
}


using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Macmillan.CMS.Common.Models
{
     public class Content
    {
      public int ContentId  {get;set;}
      public string Title   {get;set;}
      public string Description{get;set;}
      public string Publisher{get;set;}
      public string[]Subject{get;set;}
      public string  VersionState {get;set;}
      public string[]Projects{get;set;}
      public string[]Keywords{get;set;}
      public int     SystemId {get;set;}
      public string ProjectURL{get;set;}
      public DateTime DateCreated {get;set;}
      public DateTime DateModified {get;set;}
      public string CreatedBy {get;set;}
      public string Creator   {get;set;}
      public string FileFormat{get;set;}
      public string FileName  {get;set;}
    }
}

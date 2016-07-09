declare namespace mml = "http://macmillanlearning.com";
declare variable $NS := "http://macmillanlearning.com";

let $dirNames := ( "dictionary", "user", "project", "content" )

let $dirs :=
  for $dirName in $dirNames
  
    let $dir := "/"||$dirName||"/"
  
    let $query := cts:and-query((
                          cts:directory-query($dir, "infinity")
                     ))
    
    let $uris := cts:uris("", (), $query)
    
    let $_ := 
      for $uri in $uris
        return
          xdmp:document-add-collections($uri, ($dirName))
          
    return $dir

return "done"

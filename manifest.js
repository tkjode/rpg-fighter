function downloadUITemplate(filename) {
   var get = new XMLHttpRequest();
   get.addEventListener("load", function() { addUITemplate(filename, this)} );
   get.addEventListener("error", function() { conLog("Failed to load template")} );
   get.addEventListener("abort", function() { conLog("Aborted Template Load")} );
   get.addEventListener("progress", function() { conLog("Loading template...") });
   get.open("GET", filename);
   get.send();
}

function downloadInlineTemplate(filename) {
   var get = new XMLHttpRequest();
   get.addEventListener("load", function() { addInlineTemplate(filename, this)} );
   get.addEventListener("error", function() { conLog("Failed to load template")} );
   get.addEventListener("abort", function() { conLog("Aborted Template Load")} );
   get.addEventListener("progress", function() { conLog("Loading template...") });
   get.open("GET", filename);
   get.send();
}

function addUITemplate(filename, obj) {
   conLog("UI Template Loaded: " + filename);
   console.log(obj);
   uiTemplates[filename] = obj.responseText;
   console.log(uiTemplates);
}

function addInlineTemplate(filename, obj) {
   conLog("Inline Template Loaded: " + filename);
   console.log(obj);
   inlineTemplates[filename] = obj.responseText;
   console.log(inlineTemplates);
}

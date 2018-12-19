
function applyUITemplate(templateFile, uiMode){
   // Perform an AJAX Query to get the template file, assuming it's not currently active.
   var rv = false;
   if (typeof uiTemplates[templateFile] == "undefined") {
      console.log("Templates not loaded yet, fail and try again");
      rv=false;
   } else {
      if(gameState.lastUIMode==uiMode) {
         // Nothing to do, already there, return true.
         // console.log("Nothing to do.");
         rv=true;
      } else {
         // UI has switched to a new state, let's update it and update the lastUI state accordingly
         conLog("Moving to " + uiMode);
         document.getElementById('arena').innerHTML = uiTemplates[templateFile];
         console.log("Switching to UI state: " + uiMode);
         rv=true;
      }
   }
   return rv;
}

function applyInlineTemplate(templateFile, targetDiv) {
   var rv=false;
   if(typeof inlineTemplates[templateFile] == "undefined") {
      console.log("Templates note loaded yet, fail and try again");
      rv=false;
   } else {
      targetDiv.innerHTML = inlineTemplates[templateFile];
   }
}

// UI Manager handles transitions between different UI's for various game states.
function uiManager() {  
   switch(gameState.uiMode) {
      case "welcome":
         var success = applyUITemplate("welcome.tmpl", gameState.uiMode);
         break;
      case "battle":
         var success = applyUITemplate("battle.tmpl", gameState.uiMode);

         updateHeroUI();
         updateActionUI();
         updateEnemyUI();      
         break;
      case "chargen":
         var success = applyUITemplate("chargen.tmpl", gameState.uiMode);         
         // Other useful character generation UI elements should be handled here.
         updateActionUI();
         break;
      
   }      
   (debugOnline)?pokeDebug():null;
   if(success) { gameState.lastUIMode=gameState.uiMode; } 
   return success;

}

function updateEnemyUI() {
   var html="";
   html+="<DIV class=partyName>" + gameState.enemies.name + "</DIV>";
   for (enemy in gameState.enemies.members) {
      //html+="Hero Name: " + gameState.heroes.members[hero].name + "<BR>";
      html+=genEntityCard(gameState.enemies.members[enemy]);
   }
   
   document.getElementById("enemy").innerHTML = html;
   
}
  

function addAvailableAction(actionName, gameFunctionToExecute) {
   //document.getElementById('actions').innerHTML+="<BUTTON onClick='" + gameFunctionToExecute + "'>" + actionName +"</BUTTON><BR>";
   var x = new Action(actionName, gameFunctionToExecute);
   gameState.actionsAvailable.push( x );
}

function Action(N, F) {
   this.label = N;
   this.execFn = F;
}

function clearActions() { gameState.actionsAvailable = [] ; } 

function updateActionUI() {
   clearActionsUI();
   
   for ( actObj in gameState.actionsAvailable ) {      
      if(gameState.actionsAvailable[actObj]) {
         document.getElementById('actions').innerHTML+="<BUTTON onClick='" + gameState.actionsAvailable[actObj].execFn + "'>" + gameState.actionsAvailable[actObj].label +"</BUTTON><BR>";
      } else {
         // Dead Action, removed!
      }
   }
}

function clearActionsUI() {
   if(typeof document.getElementById('actions') != undefined) { 
      document.getElementById('actions').innerHTML = "";
   } else {
      // Must not be there
   }
}

function updateHeroUI() {
   var html="";
   html+="<DIV class=partyName>" + gameState.heroes.name + "</DIV>";
   for (hero in gameState.heroes.members) {
      //html+="Hero Name: " + gameState.heroes.members[hero].name + "<BR>";
      html+=genEntityCard(gameState.heroes.members[hero]);
   }
   
   document.getElementById("hero").innerHTML = html;
}

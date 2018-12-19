var gameState;
var debugOnline = true;
var uiTemplates;
var logLine=0;


function goBottom() {
   var con=document.getElementById('console');
   con.scrollTop = con.scrollHeight;
}

function conLog(line) {
   var con=document.getElementById('console');
   
   var thisLine = document.createElement("div");
   var lineText = document.createTextNode(line);
   thisLine.classList.add("logLine");
   thisLine.style.opacity = 1.0;
   
   
   thisLine.appendChild(lineText);
   con.appendChild(thisLine);
   
   setTimeout(function() { fadeIn(thisLine); }, 50);
   setTimeout(function() { fadeOut(thisLine); }, 10000);
   //con.innerHTML+="<DIV class=logLine id='log"+logLine+"'>" + logLine + "] " + line + "</DIV>";
   

   goBottom();
}

function fadeIn(divElement) {
   divElement.style.width="100%";  
}

function fadeOut(divElement) {
   divElement.style.opacity=0.0;
   divElement.style.width=0;
   setTimeout(function() { divElement.remove() }, 500);
}

function main() {

  // Initialize variables and objects
  conLog("Initializing variables and objects...");
  initGameState();
  conLog("Loading UI Elements...");
  uiTemplates = [ ];
  inlineTemplates = [ ];

// Move these to manifest downloads
  downloadUITemplate("battle.tmpl");
  downloadUITemplate("welcome.tmpl");
  downloadUITemplate("chargen.tmpl");
  
  downloadInlineTemplate("charProps.inline");
  
  
  
  conLog("Loading base classes...");

  var classes = [
   new baseClass("Tank", 200, 50, 10, 2, 10, 3, 3, 7),
   new baseClass("Technomancer", 100, 200, 4, 6, 6, 9, 9, 5),
   new baseClass("Fastguy", 50, 100, 3, 10, 10, 10, 5, 8),
   new baseClass("Meme", 100, 100, 7, 7, 7, 3, 3, 5)
   ];
  
  gameState.classes = classes;
  
  /*
  var hero = new livingEntity("tkjode", classes[1], {hp: 1000, mana: 50, strength: 2, dexterity: 5, endurance: 6, perception: 5, intelligence: 6, charisma: 4, avatar: "https://image.eveonline.com/character/912135485_128.jpg" } );
  hero.armor = new armorEntity("Cool Jacket", 5, undefined, undefined, undefined ,undefined);  
  hero.weapon = new weaponEntity("ZA WARUDO", 50, new damageSpec("Slicing", 1, { kinetic: 1 }));
  
  var hero2 = new livingEntity("Astralus", classes[0], { avatar: "http://pm1.narvii.com/6224/f83aeb16020aa186510aeea453baa2d6afeb3e78_128.jpg" } );
  //hero2.armor = new armorEntity("Cray-Cray Armor", 50, undefined, undefined, undefined ,undefined);  
  hero2.weapon = new weaponEntity("One Punch", 500000, new damageSpec("Punching", 1, { kinetic: 1 }));
  
  gameState.heroes = new party("RealBGIS Heroes");
  gameState.heroes.addMember(hero);
  gameState.heroes.addMember(hero2);
  
  var enemy = new livingEntity("Standard Pepe", classes[3], { xp: 20, avatar: "https://assets.change.org/photos/5/nx/ii/ehnxiimdJZnyRmN-128x128-noPad.jpg?1475121991" });
  enemy.armor = new armorEntity("Epic Armor", 30, undefined, undefined, undefined, undefined);
  enemy.weapon = new weaponEntity("Feels Bad Man", 50, new damageSpec("Sadness", 1, { pressure: 1 }) );
  
  gameState.enemies = new party("4chan");
  gameState.enemies.addMember(enemy);
  */
  
  //document.getElementById('hero').innerHTML = JSON.stringify(hero);
  //document.getElementById('enemy').innerHTML = JSON.stringify(enemy);
  
  conLog("Cleaning up and readying for game start");
  clearActions();
  
  startGameLoop();
  
}

function startGameLoop() {
   conLog("Booting Game Loop");
   clearActions();
   iterateGameState();
}

function initGameState() {
   gameState = { ticks: 0, turn:0, staticState: "init", actionsAvailable: [], heroes: { }, enemies: { }  };
   
}

function pokeDebug() {
   document.getElementById('gameStateDebug').innerHTML=JSON.stringify(gameState, null, '\t');
}

function iterateGameState() {
   // Do not conLog inside the game loop, only events!
   gameState.ticks++;
   switch(gameState.staticState) {
      case "init":
      case "":         
         //Quick Hax, we move to Fight state immediately
         clearActions();
         gameState.uiMode="welcome";                  
         break;
      case "fight":
         gameState.uiMode="battle";         
         break;
      case "chargen":
         gameState.uiMode="chargen";
         gameState.staticState="chargen";
         charGenManager();
         break;
   }
   
   
   uiManager();
   
   
   setTimeout(function() { iterateGameState(); }, 1000);
   
}

function charGenManager() {
   /* Goal of the Character Generation Manager is to ensure:
      - We have a Party Name before any characters are generated:
         Action: Enter Party Name, press Save, once party name is stored, we can open up the Add Char action
      - Get at least 1 Character in:
         Action: Add Character -> Load up the Character Properties Inline and allow user to save all stats
         Once saved, pop the character into the gameState Heroes Party, and either add more, or hit done (New Char / Done)
      - Move onto Enemy selection when Party Name + at least 1 Hero active in the GameState Heroes Party.
   */
   
   // Define available actions
   
   if(gameState.heroes.name == null) {
      if(document.getElementById('partyName') !== null) {
         var pNameInput = document.getElementById('partyName');
         //conLog(pNameInput.value);
         if(pNameInput.value!="" && !checkAction("Create Party")) {
            addAvailableAction("Create Party", "createParty()");
         }
            
      }         
   } else {
      // Yo, we have a hero party defined, let's add members...
      
      // First drop the "Create Party" action if it exists, we already did that.
      if(checkAction("Create Party")) { dropAction("Create Party"); } 
      if(gameState.heroes.name != null && !checkAction("Create a new Character") ) {
         addAvailableAction("Rename Party", "renameParty()");
         addAvailableAction("Create a new Character", "addCharacterInline()");
      }
   }
   
   
   
}

function addCharacterInline() {
   if(document.getElementById('charCreatorPropertiesHolder') !== null) {
      var ccHolder = document.getElementById('charCreatorPropertiesHolder');
      
      applyInlineTemplate("charProps.inline", ccHolder);
   } else {
      conLog("You got the wrong DIV, pig!");
   }
}

function renameParty() {
   if(document.getElementById('partyName').value!="") {
      gameState.heroes.name = document.getElementById('partyName').value;
      conLog("Party renamed to " + document.getElementById('partyName').value);
   } else {
      conLog("Dude no.");
   }
}

function createParty() {
   if(document.getElementById('partyName').value!="") {
      gameState.heroes = new Party(document.getElementById('partyName').value);
      conLog("Party Created: " + gameState.heroes.name);
   } else {
      conLog("What trickery is this?!");
   }
}

function checkAction(label) {
   var searchResult = false;
   for(var i=0; i<gameState.actionsAvailable.length; i++) {
      if(gameState.actionsAvailable[i]) {
         if (gameState.actionsAvailable[i].label.indexOf(label)!=-1) {
            searchResult = true;
         } else {
            // Keep moving brah.
         }
      }
   }
   
   return searchResult;
}

function dropAction(label) {
   for(var i=0; i<gameState.actionsAvailable.length; i++) {
      
      if(gameState.actionsAvailable[i].label.indexOf(label)!=-1) {
         gameState.actionsAvailable[i]=null;
      } else {
         // Nothing
      }
      
   }
}

function signalModeChange(newMode) {
   console.log("Interrupt detected - Requesting: " + newMode);
   var rv = false;
   switch(newMode) {
      case "init":
         // Bail from any game setting and reset everything.
         initGameState();
         rv=true;
         break;
      case "welcome":
         // Don't reset everything, just go back to welcome screen (this shouldn't happen normally)
         gameState.uiMode="welcome";
         rv=true;
         break;
      case "chargen":
         // Go to character creation screen, only from allowable welcome screens.
         if(gameState.staticState=="init" || gameState.staticState=="") {
            gameState.staticState="chargen";
            gameState.uiMode="chargen";
            rv=true;
         } else {
            rv=false;
         }
         break;
   }
}


function genEntityCard(entity) {
   if(entity!==undefined) { 
      var divCard="";
      divCard = "<DIV class=entityCardContainer>";
      divCard+= "<DIV class=entityName>" + entity.name +" [L:" + calcLevel(entity) + "] " + entity.className + "</DIV>";
      divCard+="<DIV class=detailContainer>";
         divCard+="<DIV class=avatarLeft>";
         if(entity.avatar!==undefined && entity.avatar!= null) {
               divCard+="<IMG class=imgAvatar SRC='" + entity.avatar + "' />";
         }
         divCard+="</DIV>";
            divCard+="<DIV class=statsRight>";
               divCard+="<DIV class=stats>";
               divCard+="HP: "+entity.hp+" / "+entity.maxhp+"<BR>";
               divCard+="MANA: "+entity.mana+"<BR>";
               divCard+="XP: " + entity.xp + "<BR>";
               (entity.armor)?divCard+="ARMOR: " + entity.armor.armorname + "<BR>":null;
               (entity.weapon)?divCard+="WEAPON: " + entity.weapon.weapName + " <BR>":null;               
               divCard+="</DIV>";
            divCard+="</DIV>";
         divCard+="</DIV>";
      divCard+="</DIV>";
      
      return divCard;
   } else {
      return "<DIV class=failLoad>Womp Womp, no entity here</DIV>";
   }
   
}


function Party(name) {
   this.name = (name!==undefined)?name:"Unnamed Party";
   this.members = [];
   
   this.addMember = function(entity) {
      this.members.push(entity);
   }
   
   this.memberCount = function() {
      return this.members.length;
   }
}


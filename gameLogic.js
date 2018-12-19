function damageSpec(dmgName, multiplier, dmgObject) {
   this.dmgName=(dmgName!==undefined)?dmgName:"BOOF DMG!";
   this.multiplier=(multiplier!==undefined)?multiplier:1.0;
   this.dmg = (dmgObject!==undefined)?dmgObject:{ kinetic: 1.0 };   
}

function baseClass(className, hp, mana, strength, dexterity, endurance, perception, intelligence, charisma, avatar, maxhp) {
   this.className = (className!==undefined)?className:"Unnamed Class";
   this.hp = (hp!==undefined)?hp:5;
   this.maxhp = (maxhp!==undefined)?maxhp:this.hp;
   this.mana = (mana!==undefined)?mana:5;
   this.strength = (strength!==undefined)?strength:5;
   this.dexterity = (dexterity!==undefined)?dexterity:5;
   this.endurance = (endurance!==undefined)?endurance:5;
   this.perception = (perception!==undefined)?perception:5;
   this.intelligence = (intelligence!==undefined)?intelligence:5;
   this.charisma = (charisma!==undefined)?charisma:5;
   this.avatar = (avatar!==undefined)?avatar:undefined;
   
   this.xp = 0;
}

function livingEntity(name, bClass, overrides) {
     
   this.name = (name!==undefined)?name:"No Named Biatch";
   
   if (bClass==undefined) {
      bClass = new baseClass();
   }
   if (overrides==undefined) {
      overrides = new baseClass;
   }
   
   this.avatar = (bClass.avatar!==undefined)?bClass.avatar:(overrides.avatar!==undefined)?overrides.avatar:null;
   
   
   this.className = (bClass.className!==undefined)?bClass.className:"Nonstandard Class";
   
   this.hp = (baseClass.hp!==undefined)?baseClass.hp:(overrides.hp!==undefined)?overrides.hp:100;
   this.maxhp = (baseClass.maxhp!==undefined)?baseClass.maxhp:(overrides.maxhp!==undefined)?overrides.maxhp:this.hp;
   this.mana = (baseClass.mana!==undefined)?baseClass.mana:(overrides.mana!==undefined)?overrides.mana:100;
   this.strength = (baseClass.strength!==undefined)?baseClass.strength:(overrides.strength!==undefined)?overrides.strength:5;
   this.dexterity = (baseClass.dexterity!==undefined)?baseClass.dexterity:(overrides.dexterity!==undefined)?overrides.dexterity:5;
   this.endurance = (baseClass.endurance!==undefined)?baseClass.endurance:(overrides.endurance!==undefined)?overrides.endurance:5;
   this.perception = (baseClass.perception!==undefined)?baseClass.perception:(overrides.perception!==undefined)?overrides.perception:5;
   this.intelligence = (baseClass.intelligence!==undefined)?baseClass.intelligence:(overrides.intelligence!==undefined)?overrides.intelligence:5;   
   this.charisma = (baseClass.charisma!==undefined)?baseClass.charisma:(overrides.charisma!==undefined)?overrides.charisma:5;
   
   
   this.xp = (overrides.xp!==undefined)?overrides.xp:0;
   
   
}

function armorEntity(armorname, soak, lowdmg, highdmg, decimation, dmgSpec) {
   this.soak=( soak !== undefined) ? soak:5;
   this.lowdmg=(lowdmg !== undefined) ? lowdmg:Math.ceil(this.soak*1.2);
   this.highdmg=(highdmg !== undefined) ? highdmg:Math.ceil(this.soak*3);
   this.decimation=(decimation!== undefined) ? decimation:Math.ceil(this.soak*10);
   this.dmgSpec=(dmgSpec!==undefined)?dmgSpec:0;
   this.armorname=(armorname!==undefined)?armorname:"Unnamed Armor";
}

function weaponEntity(weapName, baseDmg, dmgSpec, critBonus) {
   this.weapName=(weapName!==undefined)?weapName:"Fists";
   this.baseDmg=(baseDmg!==undefined)?baseDmg:1;
   this.dmgSpec=(dmgSpec!==undefined)?dmgSpec:new damageSpec();
   this.critBonus=(critBonus!==undefined)?critBonus:1.2;
}

function calcLevel(entity) {
   if(entity.xp!==undefined && entity.xp>-1) {
      return Math.ceil(Math.sqrt(entity.xp));
   } else {
      return 0;
   }
}

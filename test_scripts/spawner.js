module.exports = function (spawn, creepType,TotalEnergyCapacity,totalEnergy) {//creepRank
   var logLevel=0;
   var lvlHarvester=0;
   var lvlBuilder=0;
   var lvlPumper=0;
   var lvlHealer=0;
   var lvlGuard=0;
   var lvlRanger=0;  
   var creepRank=1; 

   var BlockofBody= [];

   var body_pumper    = [[WORK,WORK,CARRY,MOVE],        
		[WORK,WORK,CARRY,MOVE,WORK,CARRY,MOVE],                     
		[WORK,WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE]];
		
	//300,500,700
   var body_harvester = [[WORK,CARRY,MOVE],                 
		[WORK,CARRY,MOVE,WORK,CARRY,MOVE],
		[WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,MOVE],                                                        
		[WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK], 
		[WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE], 
		[WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK]];   

	//200,400,550,700,800,900
   var body_builder   = [[WORK,WORK,CARRY,MOVE], 
			[WORK,WORK,CARRY,CARRY,MOVE,MOVE],
			[WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE]];                                                                                            

	//300,400,900
   var body_guard     = [[TOUGH,MOVE,ATTACK,MOVE,ATTACK],
			[TOUGH,TOUGH,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK],
			[TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,ATTACK,MOVE,MOVE,ATTACK,MOVE]];

	 //270,410,500
   var body_healer    = [[HEAL,MOVE],                       
		[TOUGH,TOUGH,TOUGH,TOUGH,HEAL,MOVE,MOVE],
		[HEAL,HEAL,MOVE,MOVE,MOVE,MOVE]];

	//300,390,700
   var body_ranger    = [[TOUGH,RANGED_ATTACK,MOVE,MOVE],
						[TOUGH,TOUGH,RANGED_ATTACK,RANGED_ATTACK,MOVE,MOVE,MOVE],
						[TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,RANGED_ATTACK,RANGED_ATTACK,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]];

                   //260,470,660
   var PushBody = require('PushBody');

	//определяем уровени крипов
	
	
	var lvlCreeps=(TotalEnergyCapacity-300)/50
	
	//toLog(0,TotalEnergyCapacity +' '+ lvlCreeps);
	switch (true) {
	case (lvlCreeps==0): //0 extensions TotalEnergy=300
		lvlHarvester=1;
		lvlBuilder=1;
		lvlPumper=1;
		lvlHealer=1;
		lvlGuard=1;
		lvlRanger=1;
		break;
	case (lvlCreeps==1): //+1 extensions TotalEnergy=350
		lvlHarvester=1;
		lvlBuilder=1;
		lvlPumper=1;
		lvlHealer=1;
		lvlGuard=1;
		lvlRanger=1;
		break;    
	case (lvlCreeps==2): //+2 extensions TotalEnergy=400
		lvlHarvester=2;
		lvlBuilder=2;
		lvlPumper=1;
		lvlHealer=2;
		lvlGuard=1;
		lvlRanger=1;
		break;    
	case (lvlCreeps==3): //+3 extensions TotalEnergy=450
		lvlHarvester=2;
		lvlBuilder=2;
		lvlPumper=1;
		lvlHealer=2;
		lvlGuard=2;
		lvlRanger=1;
		break;    
	case (lvlCreeps==4): //+4 extensions TotalEnergy=500
		lvlHarvester=2;
		lvlBuilder=2;
		lvlPumper=2;
		lvlHealer=2;
		lvlGuard=3;
		lvlRanger=2;
		break;    
	case (lvlCreeps==5): //+5 extensions TotalEnergy=550
		lvlHarvester=3;
		lvlBuilder=2;
		lvlPumper=2;
		lvlHealer=2;
		lvlGuard=3;
		lvlRanger=2;
		break;    
	case (lvlCreeps==6): //+6 extensions TotalEnergy=600
		lvlHarvester=3;
		lvlBuilder=2;
		lvlPumper=2;
		lvlHealer=2;
		lvlGuard=3;
		lvlRanger=2;
		break;    
	case (lvlCreeps==7): //+7-11 extensions TotalEnergy=650
		lvlHarvester=3;
		lvlBuilder=2;
		lvlPumper=2;
		lvlHealer=2;
		lvlGuard=3;
		lvlRanger=2;
		break;    
	case (lvlCreeps>=8 && lvlCreeps<12): //+8-11 extensions TotalEnergy=700-850
		lvlHarvester=4;
		if (lvlCreeps==10) lvlHarvester=5;
		lvlBuilder=2;
		lvlPumper=3;
		lvlHealer=3;
		lvlGuard=3;
		lvlRanger=3;
		break;    
	case (lvlCreeps>=12): //+12 extensions TotalEnergy=900
		lvlHarvester=6;
		lvlBuilder=3;
		lvlPumper=3;
		lvlHealer=3;
		lvlGuard=3;
		lvlRanger=3;
		break;    
	}

	if (creepType == 'builder') {
		console.log('выбор builder');
		creepRank=lvlBuilder;
		BlockofBody = body_builder[creepRank-1]
	}
	if (creepType ==  'guard') {
		//console.log('выбор guard');
		creepRank=lvlGuard;
		BlockofBody = body_guard[creepRank-1]
	}
	if (creepType ==  'harvester') {
		//console.log('выбор harvester');
		creepRank=lvlHarvester;
		BlockofBody = body_harvester[creepRank-1]
	}
	if (creepType ==  'healer') {
		//console.log('выбор healer');
		creepRank=lvlHealer;
		BlockofBody = body_healer[creepRank-1]
	}
	if (creepType ==  'pumper') {
		//console.log('выбор pumper');
		creepRank=lvlPumper;
		BlockofBody = body_pumper[creepRank-1]
	}
	if (creepType ==  'ranger') {
		//console.log('выбор ranger');
		creepRank=lvlRanger;
		BlockofBody = body_pumper[creepRank-1]
	}

    if (BlockofBody.length>0 ) 
	{ //если выбрали боди
		var priceBody=CalcPrice(BlockofBody)
		if (totalEnergy>=priceBody) { //если энергии хватает для свопа выбранного боди

		toLog(4,'totalEnergy=' + totalEnergy+' CalcPrice(BlockofBody)=' + priceBody);
		toLog(4,'BlockofBody для создания крипа ' + BlockofBody);
		var stateCreep=(BlockofBody.length*(-1)*3)-1;
		var ans=spawn.createCreep(BlockofBody, null, {role: creepType, rank: creepRank, state: stateCreep});
		if (creepType =='harvester') {
			Memory.creeps[ans].source = null;
			Memory.creeps[ans].receiver = null;
		}

			toLog(3,'Отправлено задание на создание крипа: name= ' + ans+ ' state='+stateCreep);
		}
	}
	else {
	   toLog(3,'BlockofBody для создания крипа не задан ' + BlockofBody);
	}
	function CalcPrice(body) {
		var price=0;
		for (var i in body) {
			if (body[i]==WORK) price+=100;
			if (body[i]==CARRY) price+=50;
			if (body[i]==MOVE) price+=50;
			if (body[i]==ATTACK) price+=80;
			if (body[i]==RANGED_ATTACK) price+=150;
			if (body[i]==HEAL) price+=250;
			if (body[i]==TOUGH) price+=10;
		}
		return price;
	}

function toLog(loglvl,msg) { //вывод в лог
    if (logLevel>=loglvl)
		console.log(msg);
	}
}
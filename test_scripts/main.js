//=================================================================================================================
//module: main 
/*  module: main 
    TODO:  
        нужны ремонтники
        описать на основе гварда Лучника
        -выяснить проблему редкого подвисания крипов у расширителей
        -билдеры строят на конструкциях пока без приоритетов возможно нужны приоритеты
    Крипы:
        harvester добыча ресурса
        guard ближний бой
        healer лекарь
        pumper качальщик контрола
        builder строитель

    Функционал:
    + Обнаружение флагов запрета на ресурсных точках
    + Генерация по три харвеста на источник
    + Генерация Гвардов с лекарями
    + Сбор войск у Flag1
    + Автонападение гвардами на врага
    + Автолечение хиллерами крипов
    + Игнорировани Source Keeper
    + Харвесты сдают ресурс также и в расширители учитывая очереди в каждый
    + режимы экономии для расходующих ресурс крипов (качальщиков контрола и строителей) если не хватает харвестов усиливается 

экономия ресурсов
    + если нет необходимости спавнить крипов харвесты несут энергию в контроллер
    + приритетность спавна рабочих крипов

    +

    ----------------------------
    Проигрывает 9-й волне
*/

var builder = require('builder');
var guard = require('guard');
var harvester = require('harvester');
var healer = require('healer');
var pumper = require('pumper');
var spawner = require('spawner');

var harvesters = [];
var guards = [];
var builders = [];
var healers = [];
var pumpers = [];

var flagHarvester=0;

var economy = 0
var energyExtensions=0;
var energyExtensionsCapacity=0;

var FilledExtensions = Game.rooms.sim.find(FIND_MY_STRUCTURES, {
                filter: function(i) {
                    if (i.structureType == STRUCTURE_EXTENSION ) return i;
                    }});
 if (FilledExtensions.length>0) {
    for (var i in FilledExtensions) {
            energyExtensions = energyExtensions+FilledExtensions[i].energy;
            energyExtensionsCapacity = energyExtensionsCapacity+FilledExtensions[i].energyCapacity;
        }
    }

var TotalEnergy = Game.spawns.Spawn1.energy + energyExtensions;
var TotalEnergyCapacity = Game.spawns.Spawn1.energyCapacity+energyExtensionsCapacity;
for (var i in Game.creeps) {
    if(Game.creeps[i].memory.role == 'harvester') {
        harvesters.push(Game.creeps[i]);
    }
    if(Game.creeps[i].memory.role == 'guard') {
        guards.push(Game.creeps[i]);
    }
    if(Game.creeps[i].memory.role == 'builder') {
        builders.push(Game.creeps[i]);
    }
    if(Game.creeps[i].memory.role == 'healer') {
        healers.push(Game.creeps[i]);
    }
	if(Game.creeps[i].memory.role == 'pumper') {
        pumpers.push(Game.creeps[i]);
    }
}

var CoutCreeps = (healers.length+guards.length+pumpers.length+builders.length+harvesters.length);


for(var i in Memory.creeps) {
    if(!Game.creeps[i]) {
        delete Memory.creeps[i];
    }
}

// расчитываем режим экономии ресурсов в зависимости от соотношения численности добытчиков и растратчиков
if ((pumpers.length+builders.length+harvesters.length) < 1) {
    economy = 0;
} 
 else 
{
    var curentBalance = (pumpers.length+builders.length) / CoutCreeps; //чем больше баланс тем жестче экономия
    if (curentBalance <= 0.2 )  economy=0;
    if (curentBalance > 0.2)  economy=1; 
    if (curentBalance > 0.25 )  economy=2; 
    if (curentBalance > 0.3)  economy=3; 

    //console.log('Баланс='+ curentBalance + ' Экономия=' + economy+ ' curentBalance '+ curentBalance); 
}

// расчитываем режим экономии ресурсов в зависимости от соотношения численности охраны и харвестов
if ((healers.length+guards.length+pumpers.length+builders.length+harvesters.length) < 1) {
    economy = 0;
} 
 else 
{
    var curentBalance = (guards.length + healers.length) / CoutCreeps;
    if (curentBalance >= 0.45)  economy=0; 
    if (curentBalance < 0.4 )  economy=1; 
    if (curentBalance < 0.35)  economy=2; 
    if (curentBalance < 0.3 )  economy=3;
    console.log('Баланс='+ curentBalance + ' Экономия=' + economy+ ' '+ guards.length +'+' + healers.length+'/'+ (healers.length+guards.length+pumpers.length+builders.length+harvesters.length)); 
}

if(harvesters.length < 3 && CoutCreeps < 20) {
    //console.log('harvesters.length='+harvesters.length+' спавним harvester');
    Game.spawns.Spawn1.createCreep([WORK, CARRY, MOVE], null, {role: 'harvester'});
} else {

    if ((guards.length + healers.length) / harvesters.length < 0.8) {
        //console.log('харвестеров много'+' harvesters.length='+harvesters.length);
        if (guards.length < 1) {
            //console.log('спавним guarda');
            Game.spawns.Spawn1.createCreep([TOUGH, MOVE, ATTACK, MOVE, ATTACK], null, {role: 'guard'});
        } else if (healers.length / guards.length < 0.5) {
            //console.log('гвардов много - спавним хиллера');
            Game.spawns.Spawn1.createCreep([HEAL, MOVE], null, {role: 'healer'});
        } else {
            //console.log('guards.length='+guards.length+', гвардов мало - спавним guarda');
            Game.spawns.Spawn1.createCreep([TOUGH, MOVE, ATTACK, MOVE, ATTACK], null, {role: 'guard'});
        }
    } else {
        //console.log('харвестов мало - спавним харвестер');
        if (pumpers.length / harvesters.length < 0.2) { // харвестов в 5 раз больше памперов
            Game.spawns.Spawn1.createCreep([WORK, CARRY, MOVE], null, {role: 'pumper'});
        } else
        {// памперов хватает
            if(builders.length < 2 && Game.rooms.sim.controller.level > 1) { // уровень больше 1 а нету билдера
                Game.spawns.Spawn1.createCreep([WORK, WORK, CARRY, MOVE], null, {role: 'builder'});
            } else
            {
                Game.spawns.Spawn1.createCreep([WORK, CARRY, MOVE], null, {role: 'harvester'});
            }
        }
    }
}

if(harvesters.length < 3) {
    Game.spawns.Spawn1.createCreep([WORK, CARRY, MOVE], null, {role: 'harvester'});
} else if(guards.length < 2) {
    Game.spawns.Spawn1.createCreep([ATTACK, ATTACK, TOUGH, MOVE, MOVE], null, {role: 'guard'});
} else if(harvesters.length < 5) {
    Game.spawns.Spawn1.createCreep([WORK, CARRY, MOVE], null, {role: 'harvester'});
} else if(healers.length < 1) {
    Game.spawns.Spawn1.createCreep([HEAL, TOUGH, MOVE], null, {role: 'healer'});
} else if(guards.length < 3) {
    Game.spawns.Spawn1.createCreep([ATTACK, ATTACK, TOUGH, MOVE, MOVE], null, {role: 'guard'});
} else if(guards.length < 6) {
    Game.spawns.Spawn1.createCreep([ATTACK, ATTACK, TOUGH, MOVE, MOVE], null, {role: 'guard'});
}

//без охраны
/*
if (CoutCreeps < 20) {
     flagHarvester=0; 
if(harvesters.length < 3) {
   spawner(Game.spawns.Spawn1,'harvester',TotalEnergyCapacity,TotalEnergy)
} else {

     if (pumpers.length / harvesters.length < 0.2) { // харвестов в 5 раз больше памперов
            spawner(Game.spawns.Spawn1,'pumper',TotalEnergyCapacity,TotalEnergy)
        } else
        {// памперов хватает
            if(builders.length < Game.rooms.sim.controller.level/2 && Game.rooms.sim.controller.level > 1) { // уровень больше 1 а нету билдера
                spawner(Game.spawns.Spawn1,'builder',TotalEnergyCapacity,TotalEnergy)
            } else
            {
                spawner(Game.spawns.Spawn1,'harvester',TotalEnergyCapacity,TotalEnergy)
            }
        }

} 
} else
{
	flagHarvester=1;
}

if (TotalEnergy >= 550) {
    spawner(Game.spawns.Spawn1,'harvester',3,TotalEnergy)
    //Game.spawns.Spawn1.createCreep([WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE,MOVE], null, {role: 'harvester' ,  rank: '2' }); 
}

*/
for(var name in Game.creeps) {
    var creep = Game.creeps[name];

    if(creep.memory.role == 'harvester') {
        harvester(creep,flagHarvester);
    }
    if(creep.memory.role == 'builder') {
        builder(creep, economy);
    }
    if(creep.memory.role == 'guard') {
        guard(creep);
    }
    if(creep.memory.role == 'healer') {
        healer(creep);
    }
    if(creep.memory.role == 'pumper') {
        pumper(creep, economy);
    }
}






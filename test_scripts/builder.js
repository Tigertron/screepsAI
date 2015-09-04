//module: builder 
module.exports = function (creep, economy) {
var logLevel=4;

var state=creep.memory.state;
switch (true) {
//------------------------------------------------------------------------------------------   
case state<0://обнаружен создающийся билдер
    creep.memory.state++; 
     toLog(3,creep.name+'['+creep.memory.role+ '] - [21] До спавна - '+ state*(-1));
     creep.memory.state++;
break;
case state==0://обнаружен новыый билдер
    toLog(3,creep.name+'['+creep.memory.role+ '] - [21] я новый билдер');
    creep.memory.state=1;
break;

case state==1://обнаружен новыый билдер

    if(creep.carry.energy == 0) {
        //console.log('у билдер мало энергии');
        if (economy < 3) {
         creep.moveTo(Game.spawns.Spawn1);
         Game.spawns.Spawn1.transferEnergy(creep);
        }
    }
    else {
        //console.log('билдер  занят');
        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        if(targets.length) {
            creep.moveTo(targets[0]);
            creep.build(targets[0]);
        }
    }
break;
}

function toLog(loglvl,msg) { //вывод в лог
    if (logLevel>=loglvl) console.log(msg);
}
}



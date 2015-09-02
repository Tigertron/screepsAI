module.exports = function(creep)
{
    if(creep.carry.energy < creep.carryCapacity || creep.carryCapacity == 0) {
    	var sources = creep.room.find(FIND_SOURCES);
    	creep.moveTo(sources[0]);
    	creep.harvest(sources[0]);
    }
    else {
    	creep.moveTo(Game.spawns.Spawn1);
    	if (creep.transferEnergy(Game.spawns.Spawn1) == OK)
    	    Memory.energy += creep.carry.energy;
    }
    //creep.say(creep.carry.energy);
}
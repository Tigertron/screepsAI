module.exports = function(creep)
{
    
    if(creep.carry.energy < creep.carryCapacity || creep.carryCapacity == 0) {
    	var sources = creep.room.find(FIND_SOURCES);
    	if(creep.moveTo(sources[0]) == OK)
    	{
    	    if(creep.memory.timeToStart === undefined) 
    	        creep.memory.timeToStart = 0;
            else
                creep.memory.timeToStart++;
                //console.log(creep.pos, sources[0].pos);
    	}
    	creep.harvest(sources[0]);
    }
    else {
    	creep.moveTo(Game.spawns.Spawn1);
    	if (creep.transferEnergy(Game.spawns.Spawn1) == OK)
    	    Memory.energy += creep.carry.energy;
    }
    //creep.say(creep.carry.energy);
}
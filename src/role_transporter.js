module.exports = function(creep, energy)
{
    creep.memory.working = true;
    if(creep.carry.energy > 0) 
    {
        creep.moveTo(Game.spawns.Spawn1);
    	if (creep.transferEnergy(Game.spawns.Spawn1) == OK)
    	{
    	    Memory.energy += creep.carry.energy;
    	    creep.memory.working = false;
    	}
    }
    else 
    {
    	creep.moveTo(energy);
    	creep.pickup(energy);
    }
    if(creep.carry.energy)
        creep.say(creep.carry.energy);
}
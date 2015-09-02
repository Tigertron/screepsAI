module.exports = function(creep)
{
    if(creep.carry.energy == 0) 
    {
		creep.moveTo(Game.spawns.Spawn1);
		Game.spawns.Spawn1.transferEnergy(creep);
	}
	else
	{
		var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
		if(targets.length) {
			creep.moveTo(targets[0]);
			creep.build(targets[0]);
		}
		else
		{
		    creep.moveTo(Game.rooms.sim.controller);
			creep.upgradeController(Game.rooms.sim.controller);
		}
	}
 }
//module: pumper
module.exports = function (creep, economy) {
    if(creep.carry.energy > 0) {
        //console.log(creep.name+ ': energy - full');
        creep.memory.source = null;
        creep.moveTo(creep.room.controller);
        creep.upgradeController(creep.room.controller);
        return;
    }
    //если отсутствуют расширители то забираем из спавна
    //иначе если расширители заполнены более чем на 2/3
    if (!creep.memory.source) {
        creep.memory.source = {
            id: Game.spawns.Spawn1.id,
            x: Game.spawns.Spawn1.pos.x,
            y:  Game.spawns.Spawn1.pos.y
        }
    }
    if (economy < 2) {
    creep.moveTo(creep.memory.source.x, creep.memory.source.y);
    Game.spawns.Spawn1.transferEnergy(creep);
    }

}
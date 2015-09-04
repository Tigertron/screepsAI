//module: guard 
module.exports = function (creep) {
    var target = creep.pos.findClosest(FIND_HOSTILE_CREEPS);
    if(target && creep.hits > creep.hitsMax - 500 /* no more attack */ && target.owner.username != 'Source Keeper') {
        creep.moveTo(target);
        creep.attack(target);
    } else {
        if (Game.flags.Flag1) {
        creep.moveTo(Game.flags.Flag1);
        } else {
        creep.moveTo(Game.spawns.Spawn1);
        }
    }
}

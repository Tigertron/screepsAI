//module: healer
module.exports = function (creep) {
    var damagedCreep = creep.pos.findClosest(FIND_MY_CREEPS, {
        filter: function(object) {
            return object !== creep && object.hits < object.hitsMax;
        }
    });
    if (creep.hits < creep.hitsMax - 100 /* no more heal */) {
        creep.moveTo(Game.spawns.Spawn1);
        creep.heal(damagedCreep);
        return;
    }

    if(damagedCreep) {
        creep.moveTo(damagedCreep);
        creep.heal(damagedCreep);
        return;
    }

    var guard = creep.pos.findClosest(FIND_MY_CREEPS, {
        filter: function(creep) {
            return creep.memory.role === 'guard';
        }
    });
    if (guard) {
        creep.moveTo(guard);
    } else {
        creep.moveTo(Game.spawns.Spawn1);
        creep.heal(damagedCreep);
    }
}


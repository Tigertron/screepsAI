var _ = require("lodash");

module.exports = {
    creepsByRole: function(role) {
       return _.filter(Game.creeps, function(creep) {
           return creep.memory.role == role;
       });
    },
    countCreeps: function(role) {
       return this.creepsByRole(role).length;
    },
    idleSpawns: function() {
       var spawns = _.filter(Game.spawns, function(spawn) {
           return !spawn.spawning;
       });
    
       return spawns
    },
    getLeastOccupiedSource: function (role, room) {
         var sources = room.find(FIND_SOURCES);
         var creeps = this.creepsByRole(role)
         var counters = {};
    
         for(var source in sources)
           counters[sources[source].id] = 0;
    
         for(var creep in creeps)
           if(creeps[creep].memory.workingAt)
             counters[creeps[creep].memory.workingAt]++;
    
         var minKey = sources[0].id;
         var minVal = counters[sources[0].id];
    
         for(var counter in counters)
           if(counters[counter]<minVal){
             minKey = counter;
             minVal = counters[counter];
           }
    
         return minKey;
       },
    notFullSpawn: function (room) {
         var extensions = room.find(FIND_MY_STRUCTURES,	{filter: function (struct) {
           return struct.structureType === STRUCTURE_EXTENSION && struct.energy < struct.energyCapacity;
         }});
         if(extensions.length) return extensions[0];
        
         var spawns = _.filter(Game.spawns, function (spawn) {
              return spawn.energy < spawn.energyCapacity;
         });
        
         if (!spawns) return null;
         else return spawns[0];
        },
    spawnWithEnergy: function (energy) {
     var spawns = _.filter(Game.spawns, function (spawn) {
          return spawn.energy >= energy;
     });
    
     if (!spawns) return null;
     else return spawns[0];
    },
    contains: function(haystack, needle) {
        return haystack.indexOf(needle) >= 0;
    },
    flag: function(creep) {
         var self = this;
         var flags = creep.room.find(FIND_FLAGS, {
             filter: function(flag) {
               return self.contains(flag.name, creep.memory.role) || self.contains(flag.name, "ALL");
             }
         });
    
    
         if (flags.length) {
             creep.moveByHeart(flags[0], false);
         }
      },
    getClosestRepair: function (creep) {
    return creep.pos.findClosest(FIND_MY_STRUCTURES, {filter: function (struct) {
      if(struct.structureType === STRUCTURE_RAMPART)
        return struct.hits < 5000/2;
      return struct.hits < struct.hitsMax / 2;
    }})
    },
    structIsFull: function (struct) {
    if(struct.structureType === STRUCTURE_RAMPART)
      return struct.hits >= 5000;
    return struct.hits >= struct.hitsMax;
    }
}